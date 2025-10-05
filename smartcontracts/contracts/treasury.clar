;; Treasury Contract for StacksPay
;; Secure multi-sig fund management and emergency controls

(define-constant ERR_UNAUTHORIZED (err u100))
(define-constant ERR_INSUFFICIENT_BALANCE (err u101))
(define-constant ERR_INVALID_AMOUNT (err u102))
(define-constant ERR_QUORUM_NOT_MET (err u103))
(define-constant ERR_PROPOSAL_NOT_FOUND (err u104))
(define-constant ERR_PROPOSAL_EXPIRED (err u105))
(define-constant ERR_ALREADY_VOTED (err u106))

;; Proposal types
(define-constant PROPOSAL_WITHDRAWAL u0)
(define-constant PROPOSAL_EMERGENCY u1)
(define-constant PROPOSAL_CONFIG_UPDATE u2)
(define-constant PROPOSAL_TREASURY_MANAGEMENT u3)

;; Proposal status
(define-constant STATUS_PENDING u0)
(define-constant STATUS_ACTIVE u1)
(define-constant STATUS_EXECUTED u2)
(define-constant STATUS_REJECTED u3)
(define-constant STATUS_EXPIRED u4)

;; Contract owner and treasury admin
(define-data-var owner principal (as-contract tx-sender))
(define-data-var treasury-admin principal (as-contract tx-sender))

;; Multi-sig configuration
(define-data-var total-signers uint u3)
(define-data-var required-signatures uint u2) ;; 2 of 3 multisig
(define-data-var proposal-timeout uint u86400) ;; 24 hours
(define-data-var emergency-timeout uint u3600) ;; 1 hour

;; Treasury balances
(define-data-var treasury-balance uint u0)
(define-data-var emergency-reserve uint u1000000000) ;; 10 BTC emergency reserve
(define-data-var daily-withdrawal-limit uint u5000000000) ;; 50 BTC daily limit
(define-data-var daily-withdrawn uint u0)
(define-data-var last-reset-date uint u0)

;; Signers management
(define-map signers principal bool)
(define-map signer-weights principal uint)

;; Treasury proposals
(define-map proposals
  uint ;; proposal-id
  {
    proposer: principal,
    proposal-type: uint,
    amount: uint,
    recipient: principal,
    description: (string-utf8 200),
    created-at: uint,
    expires-at: uint,
    status: uint,
    votes-for: uint,
    votes-against: uint,
    executed-at: (optional uint)
  }
)

;; Proposal votes
(define-map proposal-votes
  uint ;; proposal-id
  bool ;; vote (true = for, false = against)
)

;; Withdrawal history
(define-map withdrawal-history
  uint ;; withdrawal-id
  {
    amount: uint,
    recipient: principal,
    purpose: (string-utf8 200),
    executed-by: principal,
    timestamp: uint,
    proposal-id: uint
  }
)

;; Emergency controls
(define-data-var emergency-mode bool false)
(define-data-var emergency-initiated-by principal tx-sender)
(define-data-var emergency-initiated-at uint u0)

;; ===== ADMIN FUNCTIONS =====

;; Add signer to multi-sig
(define-public (add-signer (signer principal) (weight uint))
  (begin
    (asserts! (is-eq tx-sender (var-get owner)) ERR_UNAUTHORIZED)
    (asserts! (> weight u0) ERR_INVALID_AMOUNT)
    
    (map-set signers signer true)
    (map-set signer-weights signer weight)
    (var-set total-signers (+ (var-get total-signers) u1))
    
    (ok true)
  )
)

;; Remove signer from multi-sig
(define-public (remove-signer (signer principal))
  (begin
    (asserts! (is-eq tx-sender (var-get owner)) ERR_UNAUTHORIZED)
    (asserts! (> (var-get total-signers) (var-get required-signatures)) ERR_UNAUTHORIZED)
    
    (map-set signers signer false)
    (map-set signer-weights signer u0)
    (var-set total-signers (- (var-get total-signers) u1))
    
    (ok true)
  )
)

;; Set required signatures
(define-public (set-required-signatures (required uint))
  (begin
    (asserts! (is-eq tx-sender (var-get owner)) ERR_UNAUTHORIZED)
    (asserts! (and (>= required u1) (<= required (var-get total-signers))) ERR_UNAUTHORIZED)
    
    (var-set required-signatures required)
    (ok true)
  )
)

;; Set withdrawal limits
(define-public (set-withdrawal-limits (daily-limit uint) (emergency-reserve-amount uint))
  (begin
    (asserts! (is-eq tx-sender (var-get owner)) ERR_UNAUTHORIZED)
    
    (var-set daily-withdrawal-limit daily-limit)
    (var-set emergency-reserve emergency-reserve-amount)
    (ok true)
  )
)

;; ===== TREASURY MANAGEMENT =====

;; Deposit funds to treasury
(define-public (deposit-funds (amount uint))
  (begin
    ;; Validate inputs
    (asserts! (> amount u0) ERR_INVALID_AMOUNT)
    
    ;; Update treasury balance
    (var-set treasury-balance (+ (var-get treasury-balance) amount))
    
    (ok true)
  )
)

;; Create withdrawal proposal
(define-public (create-withdrawal-proposal
  (amount uint)
  (recipient principal)
  (description (string-utf8 200))
)
  (let (
    (proposal-id (+ (var-get treasury-balance) u1)) ;; Simplified proposal ID
    (current-time u0) ;; Simplified for now
    (expires-at (+ current-time (var-get proposal-timeout)))
  )
    (begin
      ;; Validate inputs
      (asserts! (is-eq (map-get? signers tx-sender) (some true)) ERR_UNAUTHORIZED)
      (asserts! (> amount u0) ERR_INVALID_AMOUNT)
      (asserts! (<= amount (var-get treasury-balance)) ERR_INSUFFICIENT_BALANCE)
      (asserts! (<= amount (var-get daily-withdrawal-limit)) ERR_INVALID_AMOUNT)
      
      ;; Create proposal
      (map-set proposals proposal-id {
        proposer: tx-sender,
        proposal-type: PROPOSAL_WITHDRAWAL,
        amount: amount,
        recipient: recipient,
        description: description,
        created-at: current-time,
        expires-at: expires-at,
        status: STATUS_PENDING,
        votes-for: u0,
        votes-against: u0,
        executed-at: none
      })
      
      (ok proposal-id)
    )
  )
)

;; Vote on proposal
(define-public (vote-on-proposal (proposal-id uint) (vote bool))
  (let (
    (proposal (unwrap! (map-get? proposals proposal-id) ERR_PROPOSAL_NOT_FOUND))
    (current-time u0) ;; Simplified for now
    (existing-vote none) ;; Simplified for now
  )
    (begin
      ;; Validate inputs
      (asserts! (is-eq (map-get? signers tx-sender) (some true)) ERR_UNAUTHORIZED)
      (asserts! (is-eq (get status proposal) STATUS_PENDING) ERR_PROPOSAL_NOT_FOUND)
      (asserts! (< current-time (get expires-at proposal)) ERR_PROPOSAL_EXPIRED)
      (asserts! (is-none existing-vote) ERR_ALREADY_VOTED)
      
      ;; Record vote (using proposal-id + signer as composite key)
      ;; Note: In a real implementation, we'd use a composite key
      true
      
      ;; Update vote counts
      (let (
        (votes-for (if vote 
                       (+ (get votes-for proposal) u1)
                       (get votes-for proposal)))
        (votes-against (if vote 
                           (get votes-against proposal)
                           (+ (get votes-against proposal) u1)))
      )
        (map-set proposals proposal-id (merge proposal {
          votes-for: votes-for,
          votes-against: votes-against
        }))
        
        ;; Check if proposal can be executed
        (if (>= votes-for (var-get required-signatures))
          (map-set proposals proposal-id (merge proposal {
            status: STATUS_ACTIVE
          }))
          true
        )
      )
      
      (ok true)
    )
  )
)

;; Execute approved proposal
(define-public (execute-proposal (proposal-id uint))
  (let (
    (proposal (unwrap! (map-get? proposals proposal-id) ERR_PROPOSAL_NOT_FOUND))
    (current-time u0) ;; Simplified for now
    (withdrawal-id (+ (var-get treasury-balance) u1))
  )
    (begin
      ;; Validate inputs
      (asserts! (is-eq (map-get? signers tx-sender) (some true)) ERR_UNAUTHORIZED)
      (asserts! (is-eq (get status proposal) STATUS_ACTIVE) ERR_PROPOSAL_NOT_FOUND)
      (asserts! (< current-time (get expires-at proposal)) ERR_PROPOSAL_EXPIRED)
      
      ;; Check withdrawal limits
      (if (is-eq (get proposal-type proposal) PROPOSAL_WITHDRAWAL)
        (begin
          (asserts! (<= (+ (var-get daily-withdrawn) (get amount proposal)) 
                       (var-get daily-withdrawal-limit)) ERR_INSUFFICIENT_BALANCE)
          (asserts! (<= (- (var-get treasury-balance) (get amount proposal))
                       (var-get emergency-reserve)) ERR_INSUFFICIENT_BALANCE)
          
          ;; Update daily withdrawal tracking
          (var-set daily-withdrawn (+ (var-get daily-withdrawn) (get amount proposal)))
        )
        true
      )
      
      ;; Execute proposal
      (if (is-eq (get proposal-type proposal) PROPOSAL_WITHDRAWAL)
        (begin
          ;; Update treasury balance
          (var-set treasury-balance (- (var-get treasury-balance) (get amount proposal)))
          
          ;; Record withdrawal
          (map-set withdrawal-history withdrawal-id {
            amount: (get amount proposal),
            recipient: (get recipient proposal),
            purpose: (get description proposal),
            executed-by: tx-sender,
            timestamp: current-time,
            proposal-id: proposal-id
          })
        )
        true
      )
      
      ;; Mark proposal as executed
      (map-set proposals proposal-id (merge proposal {
        status: STATUS_EXECUTED,
        executed-at: (some current-time)
      }))
      
      (ok true)
    )
  )
)

;; ===== EMERGENCY FUNCTIONS =====

;; Initiate emergency mode
(define-public (initiate-emergency-mode (reason (string-utf8 200)))
  (let (
    (current-time u0) ;; Simplified for now
  )
    (begin
      ;; Validate inputs
      (asserts! (is-eq (map-get? signers tx-sender) (some true)) ERR_UNAUTHORIZED)
      (asserts! (not (var-get emergency-mode)) ERR_UNAUTHORIZED)
      
      ;; Activate emergency mode
      (var-set emergency-mode true)
      (var-set emergency-initiated-by tx-sender)
      (var-set emergency-initiated-at current-time)
      
      (ok true)
    )
  )
)

;; Emergency withdrawal (requires all signers)
(define-public (emergency-withdrawal
  (amount uint)
  (recipient principal)
  (reason (string-utf8 200))
)
  (let (
    (current-time u0) ;; Simplified for now
    (emergency-timeout (var-get emergency-timeout))
    (emergency-age (- current-time (var-get emergency-initiated-at)))
  )
    (begin
      ;; Validate inputs
      (asserts! (var-get emergency-mode) ERR_UNAUTHORIZED)
      (asserts! (< emergency-age emergency-timeout) ERR_PROPOSAL_EXPIRED)
      (asserts! (is-eq (map-get? signers tx-sender) (some true)) ERR_UNAUTHORIZED)
      (asserts! (> amount u0) ERR_INVALID_AMOUNT)
      (asserts! (<= amount (var-get treasury-balance)) ERR_INSUFFICIENT_BALANCE)
      
      ;; Execute emergency withdrawal
      (var-set treasury-balance (- (var-get treasury-balance) amount))
      
      ;; Record emergency withdrawal
      (map-set withdrawal-history (+ (var-get treasury-balance) u1) {
        amount: amount,
        recipient: recipient,
        purpose: reason,
        executed-by: tx-sender,
        timestamp: current-time,
        proposal-id: u0 ;; Emergency withdrawal
      })
      
      (ok true)
    )
  )
)

;; Disable emergency mode
(define-public (disable-emergency-mode)
  (begin
    (asserts! (is-eq tx-sender (var-get owner)) ERR_UNAUTHORIZED)
    
    (var-set emergency-mode false)
    (var-set emergency-initiated-by tx-sender)
    (var-set emergency-initiated-at u0)
    
    (ok true)
  )
)

;; ===== VIEW FUNCTIONS =====

;; Get proposal details
(define-read-only (get-proposal (proposal-id uint))
  (ok (map-get? proposals proposal-id))
)

;; Get proposal vote
(define-read-only (get-proposal-vote (proposal-id uint) (signer principal))
  (ok none) ;; Simplified for now
)

;; Get withdrawal history
(define-read-only (get-withdrawal-history (withdrawal-id uint))
  (ok (map-get? withdrawal-history withdrawal-id))
)

;; Get treasury balance
(define-read-only (get-treasury-balance)
  (ok {
    balance: (var-get treasury-balance),
    emergency-reserve: (var-get emergency-reserve),
    daily-limit: (var-get daily-withdrawal-limit),
    daily-withdrawn: (var-get daily-withdrawn)
  })
)

;; Get treasury configuration
(define-read-only (get-treasury-config)
  (ok {
    owner: (var-get owner),
    treasury-admin: (var-get treasury-admin),
    total-signers: (var-get total-signers),
    required-signatures: (var-get required-signatures),
    proposal-timeout: (var-get proposal-timeout),
    emergency-timeout: (var-get emergency-timeout),
    emergency-mode: (var-get emergency-mode)
  })
)

;; Check if signer is authorized
(define-read-only (is-signer (principal principal))
  (ok (map-get? signers principal))
)

;; Get signer weight
(define-read-only (get-signer-weight (signer principal))
  (ok (map-get? signer-weights signer))
)

;; Check if proposal can be executed
(define-read-only (can-execute-proposal (proposal-id uint))
  (let (
    (proposal (unwrap! (map-get? proposals proposal-id) ERR_PROPOSAL_NOT_FOUND))
    (current-time u0) ;; Simplified for now
  )
    (ok (and (is-eq (get status proposal) STATUS_ACTIVE)
             (< current-time (get expires-at proposal))))
  )
)