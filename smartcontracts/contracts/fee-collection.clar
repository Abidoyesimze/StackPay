;; Fee Collection Contract for StacksPay
;; Advanced fee management and revenue distribution system

(define-constant ERR_UNAUTHORIZED (err u100))
(define-constant ERR_INVALID_AMOUNT (err u101))
(define-constant ERR_INVALID_FEE_RATE (err u102))
(define-constant ERR_TREASURY_NOT_FOUND (err u103))
(define-constant ERR_INSUFFICIENT_BALANCE (err u104))
(define-constant ERR_DISTRIBUTION_FAILED (err u105))

;; Fee tiers and rates
(define-constant FEE_TIER_BASIC u0)     ;; 2.5% fee
(define-constant FEE_TIER_PRO u1)       ;; 2.0% fee  
(define-constant FEE_TIER_ENTERPRISE u2) ;; 1.5% fee

(define-constant BASIC_FEE_RATE u250)    ;; 2.5%
(define-constant PRO_FEE_RATE u200)      ;; 2.0%
(define-constant ENTERPRISE_FEE_RATE u150) ;; 1.5%

;; Revenue distribution percentages
(define-constant PLATFORM_SHARE u700)    ;; 70% to platform
(define-constant TEAM_SHARE u200)        ;; 20% to team
(define-constant TREASURY_SHARE u100)    ;; 10% to treasury

;; Contract owner and fee collector
(define-data-var owner principal (as-contract tx-sender))
(define-data-var fee-collector principal (as-contract tx-sender))

;; Fee configuration
(define-data-var base-fee-rate uint BASIC_FEE_RATE)
(define-data-var min-fee-amount uint u1000) ;; Minimum fee in satoshis
(define-data-var max-fee-amount uint u100000) ;; Maximum fee in satoshis

;; Revenue tracking
(define-data-var total-collected-fees uint u0)
(define-data-var total-distributed-fees uint u0)
(define-data-var platform-revenue uint u0)
(define-data-var team-revenue uint u0)
(define-data-var treasury-revenue uint u0)

;; Fee collection records
(define-map fee-collections
  uint ;; collection-id
  {
    payment-id: uint,
    merchant: principal,
    amount: uint,
    fee-amount: uint,
    fee-rate: uint,
    collected-at: uint,
    distributed: bool
  }
)

;; Merchant fee tiers
(define-map merchant-fee-tiers principal uint)

;; Revenue distribution addresses
(define-map distribution-addresses
  uint ;; share-type (0=platform, 1=team, 2=treasury)
  principal
)

;; Treasury contract reference
(define-data-var treasury-contract principal tx-sender)

;; ===== ADMIN FUNCTIONS =====

;; Set fee collector (only owner)
(define-public (set-fee-collector (collector principal))
  (begin
    (asserts! (is-eq tx-sender (var-get owner)) ERR_UNAUTHORIZED)
    (ok (var-set fee-collector collector))
  )
)

;; Set base fee rate
(define-public (set-base-fee-rate (rate uint))
  (begin
    (asserts! (is-eq tx-sender (var-get owner)) ERR_UNAUTHORIZED)
    (asserts! (and (>= rate u50) (<= rate u500)) ERR_INVALID_FEE_RATE) ;; 0.5% to 5%
    (ok (var-set base-fee-rate rate))
  )
)

;; Set fee limits
(define-public (set-fee-limits (min-amount uint) (max-amount uint))
  (begin
    (asserts! (is-eq tx-sender (var-get owner)) ERR_UNAUTHORIZED)
    (asserts! (< min-amount max-amount) ERR_INVALID_AMOUNT)
    (var-set min-fee-amount min-amount)
    (ok (var-set max-fee-amount max-amount))
  )
)

;; Set merchant fee tier
(define-public (set-merchant-fee-tier (merchant principal) (tier uint))
  (begin
    (asserts! (is-eq tx-sender (var-get owner)) ERR_UNAUTHORIZED)
    (asserts! (or (is-eq tier FEE_TIER_BASIC) 
                  (is-eq tier FEE_TIER_PRO) 
                  (is-eq tier FEE_TIER_ENTERPRISE)) ERR_INVALID_FEE_RATE)
    (ok (map-set merchant-fee-tiers merchant tier))
  )
)

;; Set distribution addresses
(define-public (set-distribution-address (share-type uint) (address principal))
  (begin
    (asserts! (is-eq tx-sender (var-get owner)) ERR_UNAUTHORIZED)
    (asserts! (< share-type u3) ERR_INVALID_AMOUNT) ;; 0, 1, 2 only
    (ok (map-set distribution-addresses share-type address))
  )
)

;; Set treasury contract
(define-public (set-treasury-contract (contract principal))
  (begin
    (asserts! (is-eq tx-sender (var-get owner)) ERR_UNAUTHORIZED)
    (ok (var-set treasury-contract contract))
  )
)

;; ===== FEE COLLECTION FUNCTIONS =====

;; Calculate fee for a payment amount
(define-read-only (calculate-fee (amount uint) (merchant principal))
  (let (
    (fee-tier (unwrap! (map-get? merchant-fee-tiers merchant) FEE_TIER_BASIC))
    (fee-rate (if (is-eq fee-tier FEE_TIER_PRO) 
                  PRO_FEE_RATE
                  (if (is-eq fee-tier FEE_TIER_ENTERPRISE)
                      ENTERPRISE_FEE_RATE
                      BASIC_FEE_RATE)))
    (calculated-fee (/ (* amount fee-rate) u10000))
    (final-fee (if (< calculated-fee (var-get min-fee-amount))
                   (var-get min-fee-amount)
                   (if (> calculated-fee (var-get max-fee-amount))
                       (var-get max-fee-amount)
                       calculated-fee)))
  )
    (ok final-fee)
  )
)

;; Collect fee from payment
(define-public (collect-fee 
  (payment-id uint)
  (merchant principal)
  (payment-amount uint)
)
  (let (
    (fee-amount (unwrap-panic (calculate-fee payment-amount merchant)))
    (collection-id (+ (var-get total-collected-fees) u1))
    (current-time u0) ;; Simplified for now
  )
    (begin
      ;; Validate inputs
      (asserts! (is-eq tx-sender (var-get fee-collector)) ERR_UNAUTHORIZED)
      (asserts! (> payment-amount u0) ERR_INVALID_AMOUNT)
      (asserts! (> fee-amount u0) ERR_INVALID_AMOUNT)
      
      ;; Record fee collection
      (map-set fee-collections collection-id {
        payment-id: payment-id,
        merchant: merchant,
        amount: payment-amount,
        fee-amount: fee-amount,
        fee-rate: (unwrap-panic (map-get? merchant-fee-tiers merchant) FEE_TIER_BASIC),
        collected-at: current-time,
        distributed: false
      })
      
      ;; Update totals
      (var-set total-collected-fees collection-id)
      
      ;; Auto-distribute if amount is significant
      (if (> fee-amount u10000) ;; If fee > 0.0001 BTC
        (distribute-revenue fee-amount)
        (ok true)
      )
      
      (ok collection-id)
    )
  )
)

;; ===== REVENUE DISTRIBUTION FUNCTIONS =====

;; Distribute collected fees
(define-public (distribute-revenue (amount uint))
  (let (
    (platform-amount (/ (* amount PLATFORM_SHARE) u1000))
    (team-amount (/ (* amount TEAM_SHARE) u1000))
    (treasury-amount (/ (* amount TREASURY_SHARE) u1000))
  )
    (begin
      ;; Validate inputs
      (asserts! (is-eq tx-sender (var-get fee-collector)) ERR_UNAUTHORIZED)
      (asserts! (> amount u0) ERR_INVALID_AMOUNT)
      
      ;; Update revenue tracking
      (var-set platform-revenue (+ (var-get platform-revenue) platform-amount))
      (var-set team-revenue (+ (var-get team-revenue) team-amount))
      (var-set treasury-revenue (+ (var-get treasury-revenue) treasury-amount))
      (var-set total-distributed-fees (+ (var-get total-distributed-fees) amount))
      
      ;; Mark collections as distributed
      ;; Note: In a real implementation, this would iterate through pending collections
      
      (ok true)
    )
  )
)

;; Emergency withdrawal (owner only)
(define-public (emergency-withdraw (amount uint))
  (begin
    (asserts! (is-eq tx-sender (var-get owner)) ERR_UNAUTHORIZED)
    (asserts! (<= amount (var-get platform-revenue)) ERR_INSUFFICIENT_BALANCE)
    
    ;; Update platform revenue
    (var-set platform-revenue (- (var-get platform-revenue) amount))
    
    (ok amount)
  )
)

;; ===== VIEW FUNCTIONS =====

;; Get fee collection details
(define-read-only (get-fee-collection (collection-id uint))
  (ok (map-get? fee-collections collection-id))
)

;; Get merchant fee tier
(define-read-only (get-merchant-fee-tier (merchant principal))
  (ok (map-get? merchant-fee-tiers merchant))
)

;; Get revenue statistics
(define-read-only (get-revenue-stats)
  (ok {
    total-collected: (var-get total-collected-fees),
    total-distributed: (var-get total-distributed-fees),
    platform-revenue: (var-get platform-revenue),
    team-revenue: (var-get team-revenue),
    treasury-revenue: (var-get treasury-revenue),
    base-fee-rate: (var-get base-fee-rate),
    min-fee: (var-get min-fee-amount),
    max-fee: (var-get max-fee-amount)
  })
)

;; Get fee calculation preview
(define-read-only (preview-fee (amount uint) (merchant principal))
  (calculate-fee amount merchant)
)

;; Get contract configuration
(define-read-only (get-config)
  (ok {
    owner: (var-get owner),
    fee-collector: (var-get fee-collector),
    treasury-contract: (var-get treasury-contract),
    base-fee-rate: (var-get base-fee-rate),
    min-fee-amount: (var-get min-fee-amount),
    max-fee-amount: (var-get max-fee-amount)
  })
)