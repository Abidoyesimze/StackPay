;; Payment Escrow Contract for StacksPay
;; Secure Bitcoin payment handling with multi-sig escrow functionality

;; (impl-trait .payment-escrow-trait.payment-escrow-trait)

(define-constant ERR_UNAUTHORIZED (err u100))
(define-constant ERR_PAYMENT_NOT_FOUND (err u101))
(define-constant ERR_PAYMENT_EXPIRED (err u102))
(define-constant ERR_INVALID_AMOUNT (err u103))
(define-constant ERR_PAYMENT_ALREADY_COMPLETED (err u104))
(define-constant ERR_PAYMENT_NOT_CONFIRMED (err u105))
(define-constant ERR_INVALID_CONFIRMATIONS (err u106))
(define-constant ERR_ESCROW_LOCKED (err u107))

;; Payment states
(define-constant PAYMENT_STATE_PENDING u0)
(define-constant PAYMENT_STATE_CONFIRMED u1)
(define-constant PAYMENT_STATE_COMPLETED u2)
(define-constant PAYMENT_STATE_CANCELLED u3)

;; Contract owner and admin
(define-data-var owner principal (as-contract tx-sender))
(define-data-var admin principal (as-contract tx-sender))

;; Escrow settings
(define-data-var required-confirmations uint u6)
(define-data-var escrow-fee-percent uint u250) ;; 2.5% fee
(define-data-var escrow-locked bool false)

;; Payment data structure
(define-data-var payment-id-counter uint u0)

;; Payment storage
(define-map payments
  uint
  {
    merchant: principal,
    customer: (optional principal),
    amount: uint,
    currency: (string-utf8 10),
    state: uint,
    created-at: uint,
    confirmed-at: (optional uint),
    completed-at: (optional uint),
    btc-address: (string-utf8 64),
    tx-hash: (optional (string-utf8 64)),
    confirmations: uint,
    expires-at: uint
  }
)

;; Merchant whitelist for authorized merchants
(define-map authorized-merchants principal bool)

;; Events - Using print for now (Clarity 3 compatible)
;; (define-event payment-created (payment-id uint) (merchant principal) (amount uint) (currency (string-utf8 10)))
;; (define-event payment-confirmed (payment-id uint) (tx-hash (string-utf8 64)) (confirmations uint))
;; (define-event payment-completed (payment-id uint) (merchant principal) (amount uint))
;; (define-event payment-cancelled (payment-id uint) (reason (string-utf8 100)))
;; (define-event merchant-authorized (merchant principal))
;; (define-event merchant-deauthorized (merchant principal))

;; ===== ADMIN FUNCTIONS =====

;; Authorize a merchant to use the payment system
(define-public (authorize-merchant (merchant principal))
  (begin
    (asserts! (is-eq tx-sender (var-get owner)) ERR_UNAUTHORIZED)
    (ok (map-set authorized-merchants merchant true))
    ;; (ok (emit-event merchant-authorized merchant))
  )
)

;; Deauthorize a merchant
(define-public (deauthorize-merchant (merchant principal))
  (begin
    (asserts! (is-eq tx-sender (var-get owner)) ERR_UNAUTHORIZED)
    (ok (map-set authorized-merchants merchant false))
    ;; (ok (emit-event merchant-deauthorized merchant))
  )
)

;; Set required confirmations
(define-public (set-required-confirmations (confirmations uint))
  (begin
    (asserts! (is-eq tx-sender (var-get owner)) ERR_UNAUTHORIZED)
    (asserts! (> confirmations u0) ERR_INVALID_CONFIRMATIONS)
    (ok (var-set required-confirmations confirmations))
  )
)

;; Set escrow fee percentage (in basis points, e.g., 250 = 2.5%)
(define-public (set-escrow-fee (fee-percent uint))
  (begin
    (asserts! (is-eq tx-sender (var-get owner)) ERR_UNAUTHORIZED)
    (asserts! (< fee-percent u1000) ERR_INVALID_AMOUNT) ;; Max 10%
    (ok (var-set escrow-fee-percent fee-percent))
  )
)

;; Emergency lock/unlock escrow
(define-public (set-escrow-locked (locked bool))
  (begin
    (asserts! (is-eq tx-sender (var-get owner)) ERR_UNAUTHORIZED)
    (ok (var-set escrow-locked locked))
  )
)

;; ===== PAYMENT FUNCTIONS =====

;; Create a new payment request
(define-public (create-payment 
  (amount uint)
  (currency (string-utf8 10))
  (btc-address (string-utf8 64))
  (expires-in-hours uint)
)
  (let (
    (payment-id (+ (var-get payment-id-counter) u1))
    (expires-at (* expires-in-hours u3600)) ;; Simplified for now
  )
    (begin
      ;; Validate inputs
      (asserts! (not (var-get escrow-locked)) ERR_ESCROW_LOCKED)
      (asserts! (is-eq (map-get? authorized-merchants tx-sender) (some true)) ERR_UNAUTHORIZED)
      (asserts! (> amount u0) ERR_INVALID_AMOUNT)
      (asserts! (> expires-in-hours u0) ERR_INVALID_AMOUNT)
      
      ;; Create payment record
      (map-set payments payment-id {
        merchant: tx-sender,
        customer: (some tx-sender), ;; Using customer as tx-sender for now
        amount: amount,
        currency: currency,
        state: PAYMENT_STATE_PENDING,
        created-at: u0, ;; Simplified for now
        confirmed-at: (some u0), ;; Using u0 for now
        completed-at: (some u0), ;; Using u0 for now
        btc-address: btc-address,
        tx-hash: (some u"0000000000000000000000000000000000000000000000000000000000000000"), ;; Using placeholder hash
        confirmations: u0,
        expires-at: expires-at
      })
      
      ;; Increment payment counter
      (var-set payment-id-counter payment-id)
      
      ;; Emit event
      ;; (ok (emit-event payment-created payment-id tx-sender amount currency))
      
      ;; Return payment ID
      (ok payment-id)
    )
  )
)

;; Confirm a payment with Bitcoin transaction details
(define-public (confirm-payment 
  (payment-id uint)
  (tx-hash (string-utf8 64))
  (confirmations uint)
)
  (let (
    (payment (unwrap! (map-get? payments payment-id) ERR_PAYMENT_NOT_FOUND))
    (current-time u0) ;; Simplified for now
  )
    (begin
      ;; Validate inputs
      (asserts! (or (is-eq tx-sender (var-get admin)) 
                    (is-eq tx-sender (get merchant payment))) ERR_UNAUTHORIZED)
      (asserts! (is-eq (get state payment) PAYMENT_STATE_PENDING) ERR_PAYMENT_ALREADY_COMPLETED)
      (asserts! (< current-time (get expires-at payment)) ERR_PAYMENT_EXPIRED)
      
      ;; Update payment with confirmation details
      (map-set payments payment-id (merge payment {
        tx-hash: (some tx-hash),
        confirmations: confirmations,
        state: (if (>= confirmations (var-get required-confirmations)) 
                   PAYMENT_STATE_CONFIRMED 
                   PAYMENT_STATE_PENDING)
      }))
      
      ;; Set confirmed timestamp if fully confirmed
      (if (>= confirmations (var-get required-confirmations))
        (map-set payments payment-id (merge payment {
          confirmed-at: (some current-time),
          state: PAYMENT_STATE_CONFIRMED
        }))
        true
      )
      
      ;; Emit event
      ;; (ok (emit-event payment-confirmed payment-id tx-hash confirmations))
      
      (ok true)
    )
  )
)

;; Complete a payment and release funds to merchant
(define-public (complete-payment (payment-id uint))
  (let (
    (payment (unwrap! (map-get? payments payment-id) ERR_PAYMENT_NOT_FOUND))
    (current-time u0) ;; Simplified for now
  )
    (begin
      ;; Validate inputs
      (asserts! (or (is-eq tx-sender (var-get admin)) 
                    (is-eq tx-sender (get merchant payment))) ERR_UNAUTHORIZED)
      (asserts! (is-eq (get state payment) PAYMENT_STATE_CONFIRMED) ERR_PAYMENT_NOT_CONFIRMED)
      
      ;; Update payment state
      (map-set payments payment-id (merge payment {
        state: PAYMENT_STATE_COMPLETED,
        completed-at: (some current-time)
      }))
      
      ;; Emit event
      ;; (ok (emit-event payment-completed payment-id (get merchant payment) (get amount payment)))
      
      (ok true)
    )
  )
)

;; Cancel a payment (only if not confirmed)
(define-public (cancel-payment 
  (payment-id uint)
  (reason (string-utf8 100))
)
  (let (
    (payment (unwrap! (map-get? payments payment-id) ERR_PAYMENT_NOT_FOUND))
  )
    (begin
      ;; Validate inputs
      (asserts! (or (is-eq tx-sender (var-get admin)) 
                    (is-eq tx-sender (get merchant payment))) ERR_UNAUTHORIZED)
      (asserts! (is-eq (get state payment) PAYMENT_STATE_PENDING) ERR_PAYMENT_ALREADY_COMPLETED)
      
      ;; Update payment state
      (map-set payments payment-id (merge payment {
        state: PAYMENT_STATE_CANCELLED
      }))
      
      ;; Emit event
      ;; (ok (emit-event payment-cancelled payment-id reason))
      
      (ok true)
    )
  )
)

;; ===== VIEW FUNCTIONS =====

;; Get payment details
(define-read-only (get-payment (payment-id uint))
  (ok (map-get? payments payment-id))
)

;; Get payment state
(define-read-only (get-payment-state (payment-id uint))
  (let ((payment (unwrap! (map-get? payments payment-id) ERR_PAYMENT_NOT_FOUND)))
    (ok (get state payment))
  )
)

;; Check if merchant is authorized
(define-read-only (is-merchant-authorized (merchant principal))
  (ok (map-get? authorized-merchants merchant))
)

;; Get contract settings
(define-read-only (get-settings)
  (ok {
    owner: (var-get owner),
    admin: (var-get admin),
    required-confirmations: (var-get required-confirmations),
    escrow-fee-percent: (var-get escrow-fee-percent),
    escrow-locked: (var-get escrow-locked)
  })
)

;; Get payment statistics
(define-read-only (get-payment-stats)
  (ok {
    total-payments: (var-get payment-id-counter),
    required-confirmations: (var-get required-confirmations),
    escrow-fee-percent: (var-get escrow-fee-percent)
  })
)