;; Oracle Integration Contract for StacksPay
;; Bitcoin price feeds and transaction monitoring system

(define-constant ERR_UNAUTHORIZED (err u100))
(define-constant ERR_INVALID_PRICE (err u101))
(define-constant ERR_STALE_DATA (err u102))
(define-constant ERR_ORACLE_NOT_FOUND (err u103))
(define-constant ERR_INVALID_TIMESTAMP (err u104))
(define-constant ERR_PRICE_OUT_OF_RANGE (err u105))
(define-constant ERR_CONTRACT_PAUSED (err u106))
(define-constant ERR_INVALID_CONFIDENCE (err u107))

;; Oracle types
(define-constant ORACLE_PRICE u0)
(define-constant ORACLE_CONFIRMATION u1)
(define-constant ORACLE_BLOCK_HEIGHT u2)

;; Price feed intervals
(define-constant PRICE_UPDATE_INTERVAL u300) ;; 5 minutes
(define-constant MAX_PRICE_AGE u3600) ;; 1 hour

;; Contract owner and oracle admin
(define-data-var owner principal (as-contract tx-sender))
(define-data-var oracle-admin principal (as-contract tx-sender))
(define-data-var contract-paused bool false)

;; Oracle configuration
(define-data-var price-update-interval uint PRICE_UPDATE_INTERVAL)
(define-data-var max-price-age uint MAX_PRICE_AGE)
(define-data-var min-price uint u10000) ;; $100 minimum
(define-data-var max-price uint u200000) ;; $200,000 maximum

;; Price feed data
(define-data-var latest-btc-price uint u50000) ;; Starting price
(define-data-var price-updated-at uint u0)
(define-data-var price-source (string-utf8 50) u"coinbase")

;; Transaction monitoring
(define-data-var latest-block-height uint u0)
(define-data-var block-updated-at uint u0)

;; Price history (last 24 hours)
(define-map price-history
  uint ;; timestamp
  {
    price: uint,
    volume: uint,
    source: (string-utf8 50),
    confidence: uint
  }
)

;; Oracle providers
(define-map oracle-providers
  (string-utf8 50) ;; provider name
  {
    endpoint: (string-utf8 200),
    api-key: (optional (string-utf8 100)),
    weight: uint,
    active: bool,
    last-update: uint,
    success-rate: uint
  }
)

;; Bitcoin transaction monitoring
(define-map monitored-transactions
  (string-utf8 64) ;; tx-hash
  {
    payment-id: uint,
    merchant: principal,
    expected-amount: uint,
    confirmations: uint,
    block-height: uint,
    monitoring-started: uint,
    status: uint, ;; 0=pending, 1=confirmed, 2=failed
    last-checked: uint
  }
)

;; Confirmation tracking
(define-map confirmation-events
  uint ;; event-id
  {
    tx-hash: (string-utf8 64),
    confirmations: uint,
    block-height: uint,
    timestamp: uint,
    merchant: principal,
    payment-id: uint
  }
)

;; ===== ADMIN FUNCTIONS =====

;; Set oracle admin
(define-public (set-oracle-admin (admin principal))
  (begin
    (asserts! (is-eq tx-sender (var-get owner)) ERR_UNAUTHORIZED)
    (ok (var-set oracle-admin admin))
  )
)

;; Set price update interval
(define-public (set-price-update-interval (interval uint))
  (begin
    (asserts! (is-eq tx-sender (var-get owner)) ERR_UNAUTHORIZED)
    (asserts! (> interval u60) ERR_INVALID_TIMESTAMP) ;; Min 1 minute
    (ok (var-set price-update-interval interval))
  )
)

;; Set price limits
(define-public (set-price-limits (min-price-amount uint) (max-price-amount uint))
  (begin
    (asserts! (is-eq tx-sender (var-get owner)) ERR_UNAUTHORIZED)
    (asserts! (< min-price-amount max-price-amount) ERR_INVALID_PRICE)
    (var-set min-price min-price-amount)
    (ok (var-set max-price max-price-amount))
  )
)

;; Add oracle provider
(define-public (add-oracle-provider
  (name (string-utf8 50))
  (endpoint (string-utf8 200))
  (weight uint)
  (api-key (optional (string-utf8 100)))
)
  (begin
    (asserts! (is-eq tx-sender (var-get owner)) ERR_UNAUTHORIZED)
    (asserts! (> weight u0) ERR_INVALID_PRICE)
    
    (map-set oracle-providers name {
      endpoint: endpoint,
      api-key: api-key,
      weight: weight,
      active: true,
      last-update: u0,
      success-rate: u100
    })
    
    (ok true)
  )
)

;; Pause contract (emergency function)
(define-public (pause-contract)
  (begin
    (asserts! (is-eq tx-sender (var-get owner)) ERR_UNAUTHORIZED)
    (print "OracleIntegrationPaused")
    (ok (var-set contract-paused true))
  )
)

;; Unpause contract
(define-public (unpause-contract)
  (begin
    (asserts! (is-eq tx-sender (var-get owner)) ERR_UNAUTHORIZED)
    (print "OracleIntegrationUnpaused")
    (ok (var-set contract-paused false))
  )
)

;; ===== PRICE FEED FUNCTIONS =====

;; Update Bitcoin price
(define-public (update-btc-price
  (price uint)
  (source (string-utf8 50))
  (volume uint)
  (confidence uint)
)
  (let (
    (current-time u0) ;; Simplified for now
    (provider (unwrap! (map-get? oracle-providers source) ERR_ORACLE_NOT_FOUND))
  )
    (begin
      ;; Validate inputs
      (asserts! (or (is-eq tx-sender (var-get owner)) 
                    (is-eq tx-sender (var-get oracle-admin))) ERR_UNAUTHORIZED)
      (asserts! (and (>= price (var-get min-price)) 
                     (<= price (var-get max-price))) ERR_PRICE_OUT_OF_RANGE)
      (asserts! (get active provider) ERR_ORACLE_NOT_FOUND)
      
      ;; Update price data
      (var-set latest-btc-price price)
      (var-set price-updated-at current-time)
      (var-set price-source source)
      
      ;; Store in price history
      (map-set price-history current-time {
        price: price,
        volume: volume,
        source: source,
        confidence: confidence
      })
      
      ;; Update provider stats
      (map-set oracle-providers source (merge provider {
        last-update: current-time,
        success-rate: (if (> (get success-rate provider) u90)
                          (get success-rate provider)
                          (+ (get success-rate provider) u1))
      }))
      
      (ok true)
    )
  )
)

;; Get current Bitcoin price
(define-read-only (get-btc-price)
  (let (
    (current-time u0) ;; Simplified for now
    (price-age (- current-time (var-get price-updated-at)))
  )
    (if (> price-age (var-get max-price-age))
        (err ERR_STALE_DATA)
        (ok (var-get latest-btc-price))
    )
  )
)

;; Convert BTC to USD
(define-read-only (btc-to-usd (btc-amount uint))
  (let (
    (btc-price (unwrap! (get-btc-price) ERR_STALE_DATA))
  )
    (ok (/ (* btc-amount btc-price) u100000000)) ;; Convert satoshis to USD cents
  )
)

;; Convert USD to BTC
(define-read-only (usd-to-btc (usd-amount uint))
  (let (
    (btc-price (unwrap! (get-btc-price) ERR_STALE_DATA))
  )
    (ok (/ (* usd-amount u100000000) btc-price)) ;; Convert USD cents to satoshis
  )
)

;; ===== TRANSACTION MONITORING =====

;; Start monitoring Bitcoin transaction
(define-public (start-transaction-monitoring
  (tx-hash (string-utf8 64))
  (payment-id uint)
  (merchant principal)
  (expected-amount uint)
)
  (let (
    (current-time u0) ;; Simplified for now
    (current-block u0) ;; Simplified for now
  )
    (begin
      ;; Validate inputs
      (asserts! (or (is-eq tx-sender (var-get owner)) 
                    (is-eq tx-sender (var-get oracle-admin))) ERR_UNAUTHORIZED)
      (asserts! (is-none (map-get? monitored-transactions tx-hash)) ERR_INVALID_PRICE)
      
      ;; Start monitoring
      (map-set monitored-transactions tx-hash {
        payment-id: payment-id,
        merchant: merchant,
        expected-amount: expected-amount,
        confirmations: u0,
        block-height: current-block,
        monitoring-started: current-time,
        status: u0, ;; pending
        last-checked: current-time
      })
      
      (ok true)
    )
  )
)

;; Update transaction confirmation
(define-public (update-transaction-confirmation
  (tx-hash (string-utf8 64))
  (confirmations uint)
  (block-number uint)
)
  (let (
    (current-time u0) ;; Simplified for now
    (transaction (unwrap! (map-get? monitored-transactions tx-hash) ERR_ORACLE_NOT_FOUND))
    (event-id (+ (var-get latest-block-height) u1))
  )
    (begin
      ;; Validate inputs
      (asserts! (or (is-eq tx-sender (var-get owner)) 
                    (is-eq tx-sender (var-get oracle-admin))) ERR_UNAUTHORIZED)
      
      ;; Update transaction record
      (map-set monitored-transactions tx-hash (merge transaction {
        confirmations: confirmations,
        block-height: block-number,
        last-checked: current-time,
        status: (if (>= confirmations u6) u1 u0) ;; confirmed if >= 6 confirmations
      }))
      
      ;; Record confirmation event
      (map-set confirmation-events event-id {
        tx-hash: tx-hash,
        confirmations: confirmations,
        block-height: block-number,
        timestamp: current-time,
        merchant: (get merchant transaction),
        payment-id: (get payment-id transaction)
      })
      
      (ok true)
    )
  )
)

;; Update Bitcoin block height
(define-public (update-block-height (block-number uint))
  (let (
    (current-time u0) ;; Simplified for now
  )
    (begin
      ;; Validate inputs
      (asserts! (or (is-eq tx-sender (var-get owner)) 
                    (is-eq tx-sender (var-get oracle-admin))) ERR_UNAUTHORIZED)
      (asserts! (> block-number (var-get latest-block-height)) ERR_INVALID_TIMESTAMP)
      
      ;; Update block height
      (var-set latest-block-height block-number)
      (var-set block-updated-at current-time)
      
      (ok true)
    )
  )
)

;; ===== PRICE AGGREGATION =====

;; Calculate weighted average price from multiple sources
(define-read-only (get-weighted-price)
  (let (
    (coinbase-price (var-get latest-btc-price)) ;; Simplified - would aggregate from multiple sources
    (binance-price (var-get latest-btc-price)) ;; Simplified
    (kraken-price (var-get latest-btc-price)) ;; Simplified
  )
    (ok (/ (+ (+ coinbase-price binance-price) kraken-price) u3))
  )
)

;; Get price with confidence score
(define-read-only (get-price-with-confidence)
  (let (
    (price (unwrap! (get-btc-price) ERR_STALE_DATA))
    (confidence u95) ;; Simplified confidence calculation
  )
    (ok {
      price: price,
      confidence: confidence,
      source: (var-get price-source),
      updated-at: (var-get price-updated-at)
    })
  )
)

;; ===== VIEW FUNCTIONS =====

;; Get transaction monitoring status
(define-read-only (get-transaction-status (tx-hash (string-utf8 64)))
  (ok (map-get? monitored-transactions tx-hash))
)

;; Get confirmation event
(define-read-only (get-confirmation-event (event-id uint))
  (ok (map-get? confirmation-events event-id))
)

;; Get price history entry
(define-read-only (get-price-history (timestamp uint))
  (ok (map-get? price-history timestamp))
)

;; Get oracle provider info
(define-read-only (get-oracle-provider (name (string-utf8 50)))
  (ok (map-get? oracle-providers name))
)

;; Get oracle statistics
(define-read-only (get-oracle-stats)
  (ok {
    latest-price: (var-get latest-btc-price),
    price-updated-at: (var-get price-updated-at),
    latest-block-height: (var-get latest-block-height),
    block-updated-at: (var-get block-updated-at),
    price-source: (var-get price-source),
    price-update-interval: (var-get price-update-interval),
    max-price-age: (var-get max-price-age)
  })
)

;; Check if price data is fresh
(define-read-only (is-price-fresh)
  (let (
    (current-time u0) ;; Simplified for now
    (price-age (- current-time (var-get price-updated-at)))
  )
    (ok (< price-age (var-get max-price-age)))
  )
)

;; Get exchange rate for specific currency
(define-read-only (get-exchange-rate (from-currency (string-utf8 10)) (to-currency (string-utf8 10)))
  (if (and (is-eq from-currency u"BTC") (is-eq to-currency u"USD"))
      (get-btc-price)
      (err ERR_INVALID_PRICE) ;; Only BTC/USD supported for now
  )
)