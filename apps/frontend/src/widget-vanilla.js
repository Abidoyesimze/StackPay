// Vanilla JavaScript payment widget - ultra lightweight
(function() {
  'use strict';

  // Widget configuration
  let config = {};
  let paymentData = null;
  let isLoading = false;
  let status = 'pending';
  let copied = false;

  // Utility functions
  function formatBTC(satoshis) {
    return (satoshis / 100000000).toFixed(8);
  }

  function getStatusStyle(status) {
    const styles = {
      pending: { bg: '#fef3c7', color: '#92400e', icon: '⏳' },
      confirmed: { bg: '#dbeafe', color: '#1e40af', icon: '✅' },
      complete: { bg: '#d1fae5', color: '#065f46', icon: '🎉' },
      failed: { bg: '#fee2e2', color: '#991b1b', icon: '❌' }
    };
    return styles[status] || styles.failed;
  }

  function createElement(tag, attributes = {}, children = []) {
    const element = document.createElement(tag);
    Object.keys(attributes).forEach(key => {
      if (key === 'style' && typeof attributes[key] === 'object') {
        Object.assign(element.style, attributes[key]);
      } else if (key === 'className') {
        element.className = attributes[key];
      } else {
        element[key] = attributes[key];
      }
    });
    children.forEach(child => {
      if (typeof child === 'string') {
        element.appendChild(document.createTextNode(child));
      } else {
        element.appendChild(child);
      }
    });
    return element;
  }

  function createPayment() {
    if (isLoading) return;
    
    isLoading = true;
    updateUI();

    // Simulate payment creation
    setTimeout(() => {
      paymentData = {
        paymentId: 'pay_' + Date.now(),
        address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
        amount: config.amount,
        currency: config.currency || 'BTC',
        status: 'pending',
        createdAt: new Date().toISOString(),
        description: config.description
      };

      status = 'pending';
      isLoading = false;
      updateUI();
      config.onStatusChange?.('pending');

      // Simulate status progression
      setTimeout(() => {
        status = 'confirmed';
        updateUI();
        config.onStatusChange?.('confirmed');
      }, 2000);

      setTimeout(() => {
        status = 'complete';
        updateUI();
        config.onStatusChange?.('complete');
        config.onPaymentComplete?.(paymentData);
      }, 5000);

    }, 1000);
  }

  function copyAddress() {
    if (!paymentData?.address) return;
    
    navigator.clipboard.writeText(paymentData.address).then(() => {
      copied = true;
      updateUI();
      setTimeout(() => {
        copied = false;
        updateUI();
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy address:', err);
    });
  }

  function updateUI() {
    const container = document.getElementById('stackspay-widget');
    if (!container) return;

    container.innerHTML = '';
    
    const widget = createElement('div', {
      style: {
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb',
        padding: '24px',
        maxWidth: '400px',
        fontFamily: 'system-ui, sans-serif'
      }
    });

    // Header
    const header = createElement('div', {
      style: { textAlign: 'center', marginBottom: '24px' }
    }, [
      createElement('h2', {
        style: { fontSize: '24px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }
      }, ['Pay with Bitcoin']),
      createElement('div', {
        style: { fontSize: '18px', fontWeight: '600', color: '#0ea5e9' }
      }, [formatBTC(config.amount) + ' BTC']),
      config.description ? createElement('p', {
        style: { fontSize: '14px', color: '#6b7280', marginTop: '4px' }
      }, [config.description]) : null
    ].filter(Boolean));

    // Status
    let statusElement = null;
    if (paymentData) {
      const statusStyle = getStatusStyle(status);
      statusElement = createElement('div', {
        style: { display: 'flex', justifyContent: 'center', marginBottom: '16px' }
      }, [
        createElement('div', {
          style: {
            display: 'inline-flex',
            alignItems: 'center',
            padding: '4px 10px',
            borderRadius: '9999px',
            fontSize: '12px',
            fontWeight: '500',
            background: statusStyle.bg,
            color: statusStyle.color
          }
        }, [
          createElement('span', { style: { marginRight: '4px' } }, [statusStyle.icon]),
          status.charAt(0).toUpperCase() + status.slice(1)
        ])
      ]);
    }

    // Content
    let contentElement;
    if (!paymentData) {
      contentElement = createElement('div', {
        style: { textAlign: 'center' }
      }, [
        createElement('button', {
          style: {
            backgroundColor: isLoading ? '#9ca3af' : '#0ea5e9',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '6px',
            border: 'none',
            fontSize: '14px',
            fontWeight: '500',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            width: '100%',
            transition: 'background-color 0.2s'
          },
          onclick: createPayment,
          disabled: isLoading
        }, [isLoading ? 'Creating Payment...' : 'Create Payment'])
      ]);
    } else {
      contentElement = createElement('div', {
        style: { display: 'flex', flexDirection: 'column', gap: '16px' }
      }, [
        // QR Code Placeholder
        createElement('div', {
          style: { display: 'flex', justifyContent: 'center' }
        }, [
          createElement('div', {
            style: {
              width: '200px',
              height: '200px',
              backgroundColor: '#f3f4f6',
              border: '2px solid #d1d5db',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              color: '#6b7280',
              textAlign: 'center',
              flexDirection: 'column'
            }
          }, [
            'QR Code',
            createElement('br'),
            formatBTC(config.amount) + ' BTC'
          ])
        ]),
        // Bitcoin Address
        createElement('div', {}, [
          createElement('label', {
            style: { display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }
          }, ['Bitcoin Address:']),
          createElement('div', {
            style: {
              fontFamily: 'monospace',
              fontSize: '12px',
              backgroundColor: '#f3f4f6',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #d1d5db',
              wordBreak: 'break-all'
            }
          }, [paymentData.address])
        ]),
        // Copy Button
        createElement('button', {
          style: {
            backgroundColor: '#0ea5e9',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '6px',
            border: 'none',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            width: '100%',
            transition: 'background-color 0.2s'
          },
          onclick: copyAddress
        }, [copied ? 'Copied!' : 'Copy Address']),
        // Instructions
        createElement('div', {
          style: { textAlign: 'center', fontSize: '12px', color: '#6b7280' }
        }, [
          createElement('p', {}, ['Scan the QR code with your Bitcoin wallet or copy the address above.']),
          createElement('p', { style: { marginTop: '4px' } }, ['Payment will be confirmed automatically.'])
        ])
      ]);
    }

    // Assemble widget
    widget.appendChild(header);
    if (statusElement) widget.appendChild(statusElement);
    widget.appendChild(contentElement);
    container.appendChild(widget);
  }

  function initializeWidget() {
    const containers = document.querySelectorAll('[id^="stackspay-widget"]');
    
    containers.forEach((container) => {
      const element = container;
      
      config = {
        apiKey: element.dataset.apiKey || '',
        amount: parseInt(element.dataset.amount || '0'),
        currency: element.dataset.currency || 'BTC',
        description: element.dataset.description,
        onPaymentComplete: (payment) => {
          const event = new CustomEvent('stackspay:payment-complete', { detail: payment });
          document.dispatchEvent(event);
        },
        onPaymentError: (error) => {
          const event = new CustomEvent('stackspay:payment-error', { detail: error });
          document.dispatchEvent(event);
        },
        onStatusChange: (status) => {
          const event = new CustomEvent('stackspay:status-change', { detail: { status } });
          document.dispatchEvent(event);
        }
      };

      if (!config.apiKey || !config.amount) {
        console.error('StackPay Widget: Missing required apiKey or amount');
        return;
      }

      updateUI();
    });
  }

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeWidget);
  } else {
    initializeWidget();
  }

  // Global object for script tag usage
  window.StacksPayWidget = {
    initialize: initializeWidget
  };

})();
