;; Merchant Registry Contract for StacksPay
;; Advanced merchant management and reputation system

(define-constant ERR_UNAUTHORIZED (err u100))
(define-constant ERR_MERCHANT_NOT_FOUND (err u101))
(define-constant ERR_MERCHANT_ALREADY_EXISTS (err u102))
(define-constant ERR_INVALID_TIER (err u103))
(define-constant ERR_INSUFFICIENT_REPUTATION (err u104))
(define-constant ERR_KYC_REQUIRED (err u105))

;; Merchant tiers
(define-constant TIER_BASIC u0)
(define-constant TIER_PRO u1)
(define-constant TIER_ENTERPRISE u2)
(define-constant TIER_PREMIUM u3)

;; Merchant status
(define-constant STATUS_PENDING u0)
(define-constant STATUS_ACTIVE u1)
(define-constant STATUS_SUSPENDED u2)
(define-constant STATUS_BANNED u3)
(define-constant STATUS_VERIFIED u4)

;; KYC levels
(define-constant KYC_NONE u0)
(define-constant KYC_BASIC u1)
(define-constant KYC_ADVANCED u2)
(define-constant KYC_ENTERPRISE u3)

;; Contract owner and registry admin
(define-data-var owner principal (as-contract tx-sender))
(define-data-var registry-admin principal (as-contract tx-sender))

;; Registry configuration
(define-data-var total-merchants uint u0)
(define-data-var verification-required bool true)
(define-data-var min-reputation-score uint u100)

;; Merchant data structure
(define-map merchants
  principal ;; merchant address
  {
    business-name: (string-utf8 100),
    business-type: (string-utf8 50),
    contact-email: (string-utf8 100),
    website: (optional (string-utf8 200)),
    tier: uint,
    status: uint,
    kyc-level: uint,
    reputation-score: uint,
    total-transactions: uint,
    total-volume: uint,
    registration-date: uint,
    last-active: uint,
    verification-status: bool,
    compliance-score: uint
  }
)

;; Merchant metadata
(define-map merchant-metadata
  principal
  {
    country: (string-utf8 50),
    industry: (string-utf8 50),
    employee-count: uint,
    annual-revenue: uint,
    risk-level: uint
  }
)

;; Merchant capabilities and limits
(define-map merchant-limits
  principal
  {
    daily-limit: uint,
    monthly-limit: uint,
    per-transaction-limit: uint,
    auto-settlement: bool,
    webhook-enabled: bool
  }
)

;; Reputation tracking
(define-map reputation-events
  uint ;; event-id
  {
    merchant: principal,
    event-type: uint, ;; 0=payment, 1=dispute, 2=compliance, 3=verification
    score-change: uint,
    timestamp: uint,
    description: (string-utf8 200)
  }
)

;; Verification records
(define-map verification-records
  principal
  {
    kyc-provider: (string-utf8 50),
    verification-id: (string-utf8 100),
    verification-date: uint,
    expiry-date: uint,
    status: uint,
    documents-verified: bool
  }
)

;; ===== ADMIN FUNCTIONS =====

;; Set registry admin
(define-public (set-registry-admin (admin principal))
  (begin
    (asserts! (is-eq tx-sender (var-get owner)) ERR_UNAUTHORIZED)
    (ok (var-set registry-admin admin))
  )
)

;; Set verification requirements
(define-public (set-verification-required (required bool))
  (begin
    (asserts! (is-eq tx-sender (var-get owner)) ERR_UNAUTHORIZED)
    (ok (var-set verification-required required))
  )
)

;; Set minimum reputation score
(define-public (set-min-reputation (min-score uint))
  (begin
    (asserts! (is-eq tx-sender (var-get owner)) ERR_UNAUTHORIZED)
    (ok (var-set min-reputation-score min-score))
  )
)

;; ===== MERCHANT REGISTRATION =====

;; Register new merchant
(define-public (register-merchant
  (merchant principal)
  (business-name (string-utf8 100))
  (business-type (string-utf8 50))
  (contact-email (string-utf8 100))
  (website (optional (string-utf8 200)))
  (country (string-utf8 50))
  (industry (string-utf8 50))
)
  (let (
    (current-time u0) ;; Simplified for now
    (merchant-id (+ (var-get total-merchants) u1))
  )
    (begin
      ;; Validate inputs
      (asserts! (or (is-eq tx-sender (var-get owner)) 
                    (is-eq tx-sender (var-get registry-admin))) ERR_UNAUTHORIZED)
      (asserts! (is-none (map-get? merchants merchant)) ERR_MERCHANT_ALREADY_EXISTS)
      
      ;; Create merchant record
      (map-set merchants merchant {
        business-name: business-name,
        business-type: business-type,
        contact-email: contact-email,
        website: website,
        tier: TIER_BASIC,
        status: STATUS_PENDING,
        kyc-level: KYC_NONE,
        reputation-score: u100, ;; Starting reputation
        total-transactions: u0,
        total-volume: u0,
        registration-date: current-time,
        last-active: current-time,
        verification-status: false,
        compliance-score: u50 ;; Starting compliance score
      })
      
      ;; Set metadata
      (map-set merchant-metadata merchant {
        country: country,
        industry: industry,
        employee-count: u0,
        annual-revenue: u0,
        risk-level: u5 ;; Medium risk initially
      })
      
      ;; Set default limits based on tier
      (map-set merchant-limits merchant {
        daily-limit: u100000000, ;; 1 BTC
        monthly-limit: u1000000000, ;; 10 BTC
        per-transaction-limit: u10000000, ;; 0.1 BTC
        auto-settlement: false,
        webhook-enabled: false
      })
      
      ;; Update total merchants
      (var-set total-merchants merchant-id)
      
      (ok merchant)
    )
  )
)

;; ===== MERCHANT MANAGEMENT =====

;; Update merchant information
(define-public (update-merchant-info
  (merchant principal)
  (business-name (string-utf8 100))
  (business-type (string-utf8 50))
  (contact-email (string-utf8 100))
  (website (optional (string-utf8 200)))
)
  (let (
    (merchant-data (unwrap-panic (map-get? merchants merchant)))
  )
    (begin
      ;; Validate inputs
      (asserts! (or (is-eq tx-sender (var-get owner)) 
                    (is-eq tx-sender (var-get registry-admin))
                    (is-eq tx-sender merchant)) ERR_UNAUTHORIZED)
      
      ;; Update merchant data
      (map-set merchants merchant (merge merchant-data {
        business-name: business-name,
        business-type: business-type,
        contact-email: contact-email,
        website: website
      }))
      
      (ok true)
    )
  )
)

;; Set merchant tier
(define-public (set-merchant-tier (merchant principal) (tier uint))
  (let (
    (merchant-data (unwrap-panic (map-get? merchants merchant)))
  )
    (begin
      ;; Validate inputs
      (asserts! (or (is-eq tx-sender (var-get owner)) 
                    (is-eq tx-sender (var-get registry-admin))) ERR_UNAUTHORIZED)
      (asserts! (and (>= tier u0) (<= tier u3)) ERR_INVALID_TIER)
      
      ;; Update tier and adjust limits
      (map-set merchants merchant (merge merchant-data {
        tier: tier
      }))
      
      ;; Update limits based on tier
      (let (
        (limits (unwrap-panic (map-get? merchant-limits merchant)))
        (new-daily-limit (if (is-eq tier TIER_PREMIUM) 
                             u10000000000 ;; 100 BTC
                             (if (is-eq tier TIER_ENTERPRISE)
                                 u5000000000 ;; 50 BTC
                                 (if (is-eq tier TIER_PRO)
                                     u1000000000 ;; 10 BTC
                                     u100000000)))) ;; 1 BTC
        (new-monthly-limit (* new-daily-limit u30))
        (new-per-tx-limit (/ new-daily-limit u10))
      )
        (map-set merchant-limits merchant (merge limits {
          daily-limit: new-daily-limit,
          monthly-limit: new-monthly-limit,
          per-transaction-limit: new-per-tx-limit
        }))
      )
      
      (ok true)
    )
  )
)

;; Set merchant status
(define-public (set-merchant-status (merchant principal) (status uint))
  (let (
    (merchant-data (unwrap-panic (map-get? merchants merchant)))
  )
    (begin
      ;; Validate inputs
      (asserts! (or (is-eq tx-sender (var-get owner)) 
                    (is-eq tx-sender (var-get registry-admin))) ERR_UNAUTHORIZED)
      (asserts! (and (>= status u0) (<= status u4)) ERR_INVALID_TIER)
      
      ;; Update status
      (map-set merchants merchant (merge merchant-data {
        status: status
      }))
      
      (ok true)
    )
  )
)

;; ===== REPUTATION SYSTEM =====

;; Update merchant reputation
(define-public (update-reputation
  (merchant principal)
  (score-change uint)
  (event-type uint)
  (description (string-utf8 200))
)
  (let (
    (merchant-data (unwrap-panic (map-get? merchants merchant)))
    (current-score (get reputation-score merchant-data))
    (new-score (if (< (+ current-score score-change) u0)
                   u0
                   (+ current-score score-change)))
    (event-id (+ (var-get total-merchants) u1)) ;; Simplified event ID
    (current-time u0)
  )
    (begin
      ;; Validate inputs
      (asserts! (or (is-eq tx-sender (var-get owner)) 
                    (is-eq tx-sender (var-get registry-admin))) ERR_UNAUTHORIZED)
      
      ;; Update reputation score
      (map-set merchants merchant (merge merchant-data {
        reputation-score: new-score
      }))
      
      ;; Record reputation event
      (map-set reputation-events event-id {
        merchant: merchant,
        event-type: event-type,
        score-change: score-change,
        timestamp: current-time,
        description: description
      })
      
      (ok new-score)
    )
  )
)

;; ===== VERIFICATION SYSTEM =====

;; Submit KYC verification
(define-public (submit-kyc-verification
  (merchant principal)
  (kyc-provider (string-utf8 50))
  (verification-id (string-utf8 100))
  (kyc-level uint)
)
  (let (
    (merchant-data (unwrap-panic (map-get? merchants merchant)))
    (current-time u0)
    (expiry-time (+ current-time u31536000)) ;; 1 year from now
  )
    (begin
      ;; Validate inputs
      (asserts! (is-eq tx-sender merchant) ERR_UNAUTHORIZED)
      (asserts! (and (>= kyc-level u1) (<= kyc-level u3)) ERR_INVALID_TIER)
      
      ;; Create verification record
      (map-set verification-records merchant {
        kyc-provider: kyc-provider,
        verification-id: verification-id,
        verification-date: current-time,
        expiry-date: expiry-time,
        status: STATUS_PENDING,
        documents-verified: false
      })
      
      ;; Update merchant KYC level
      (map-set merchants merchant (merge merchant-data {
        kyc-level: kyc-level
      }))
      
      (ok true)
    )
  )
)

;; Approve KYC verification
(define-public (approve-kyc-verification (merchant principal))
  (let (
    (merchant-data (unwrap-panic (map-get? merchants merchant)))
    (verification (unwrap-panic (map-get? verification-records merchant)))
  )
    (begin
      ;; Validate inputs
      (asserts! (or (is-eq tx-sender (var-get owner)) 
                    (is-eq tx-sender (var-get registry-admin))) ERR_UNAUTHORIZED)
      
      ;; Update verification record
      (map-set verification-records merchant (merge verification {
        status: STATUS_VERIFIED,
        documents-verified: true
      }))
      
      ;; Update merchant status and compliance score
      (map-set merchants merchant (merge merchant-data {
        verification-status: true,
        compliance-score: u90, ;; High compliance after KYC
        status: STATUS_ACTIVE
      }))
      
      ;; Increase reputation for completing KYC
      (update-reputation merchant u10 u3 u"KYC verification completed")
      
      (ok true)
    )
  )
)

;; ===== TRANSACTION TRACKING =====

;; Record transaction
(define-public (record-transaction
  (merchant principal)
  (amount uint)
)
  (let (
    (merchant-data (unwrap-panic (map-get? merchants merchant)))
    (current-time u0)
  )
    (begin
      ;; Validate inputs
      (asserts! (or (is-eq tx-sender (var-get owner)) 
                    (is-eq tx-sender (var-get registry-admin))) ERR_UNAUTHORIZED)
      
      ;; Update transaction stats
      (map-set merchants merchant (merge merchant-data {
        total-transactions: (+ (get total-transactions merchant-data) u1),
        total-volume: (+ (get total-volume merchant-data) amount),
        last-active: current-time
      }))
      
      ;; Increase reputation for successful transaction
      (update-reputation merchant u5 u0 u"Successful payment transaction")
      
      (ok true)
    )
  )
)

;; ===== VIEW FUNCTIONS =====

;; Get merchant details
(define-read-only (get-merchant (merchant principal))
  (ok (map-get? merchants merchant))
)

;; Get merchant metadata
(define-read-only (get-merchant-metadata (merchant principal))
  (ok (map-get? merchant-metadata merchant))
)

;; Get merchant limits
(define-read-only (get-merchant-limits (merchant principal))
  (ok (map-get? merchant-limits merchant))
)

;; Get verification record
(define-read-only (get-verification-record (merchant principal))
  (ok (map-get? verification-records merchant))
)

;; Get reputation events
(define-read-only (get-reputation-events (event-id uint))
  (ok (map-get? reputation-events event-id))
)

;; Get registry statistics
(define-read-only (get-registry-stats)
  (ok {
    total-merchants: (var-get total-merchants),
    verification-required: (var-get verification-required),
    min-reputation-score: (var-get min-reputation-score)
  })
)

;; Check if merchant is active
(define-read-only (is-merchant-active (merchant principal))
  (let ((merchant-data (unwrap! (map-get? merchants merchant) ERR_MERCHANT_NOT_FOUND)))
    (ok (is-eq (get status merchant-data) STATUS_ACTIVE))
  )
)

;; Get merchant tier
(define-read-only (get-merchant-tier (merchant principal))
  (let ((merchant-data (unwrap! (map-get? merchants merchant) ERR_MERCHANT_NOT_FOUND)))
    (ok (get tier merchant-data))
  )
)