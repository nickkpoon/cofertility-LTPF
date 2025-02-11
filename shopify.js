console.log('Script starting...');

(function () {
    var scriptURL = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js';

    function ShopifyBuyInit() {
        console.log('Initializing Shopify Buy...');
        var client = ShopifyBuy.buildClient({
            domain: '9ir1hq-uv.myshopify.com',
            storefrontAccessToken: 'fd91556ac01f8893b8525b483ee891f7',
        });

        ShopifyBuy.UI.onReady(client).then(function (ui) {
            console.log('Shopify UI is ready');

            ui.createComponent('product', {
                id: '9091526197479',
                node: document.getElementById('product-component-1737655084825'),
                moneyFormat: '%24%7B%7Bamount%7D%7D',
                options: {
                    "product": {
                        "contents": {
                            "button": true,
                            "quantity": true
                        },
                        "styles": {
                            "product": {
                                "visibility": "visible"
                            },
                            "button": {
                                "font-weight": "bold",
                                "color": "#065951",
                                "background-color": "#d2fc99",
                                ":hover": {
                                    "color": "#065951",
                                    "background-color": "#bde38a"
                                },
                                "border-radius": "34px"
                            }
                        },
                        "buttonDestination": "checkout",
                        "text": {
                            "button": "Buy now"
                        }
                    }
                }
            }).then(function (component) {
                console.log('Component created successfully');
            });
        });
    }

    function loadScript() {
        console.log('Loading Shopify script...');
        var script = document.createElement('script');
        script.async = true;
        script.src = scriptURL;
        script.onload = function () {
            console.log('Shopify script loaded successfully');
            ShopifyBuyInit();
        };
        (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(script);
    }

    if (window.ShopifyBuy) {
        if (window.ShopifyBuy.UI) {
            console.log('Shopify Buy already loaded');
            ShopifyBuyInit();
        } else {
            loadScript();
        }
    } else {
        loadScript();
    }
})();

// Initialize controls
window.addEventListener('load', function () {
    console.log('Window fully loaded');

    function initializeControls() {
        console.log('Initializing controls...');

        const minusBtn = document.querySelector('.custom-minus-btn');
        const plusBtn = document.querySelector('.custom-plus-btn');
        const quantityInput = document.querySelector('.custom-quantity');
        const buyNowBtn = document.querySelector('.custom-buy-now-btn');

        if (!minusBtn || !plusBtn || !quantityInput || !buyNowBtn) {
            console.log('Missing some elements, will retry in 1 second');
            setTimeout(initializeControls, 1000);
            return;
        }

        console.log('All controls found:', {
            minusBtn: minusBtn,
            plusBtn: plusBtn,
            quantityInput: quantityInput,
            buyNowBtn: buyNowBtn
        });

        // Set initial value
        quantityInput.value = '1';
        console.log('Initial quantity set to:', quantityInput.value);

        // Minus button click
        minusBtn.addEventListener('click', function () {
            let currentValue = parseInt(quantityInput.value) || 1;
            console.log('Minus clicked, current value:', currentValue);
            if (currentValue > 1) {
                currentValue--;
                quantityInput.value = currentValue;
                console.log('Value decreased to:', currentValue);
            }
        });

        // Plus button click
        plusBtn.addEventListener('click', function () {
            let currentValue = parseInt(quantityInput.value) || 1;
            console.log('Plus clicked, current value:', currentValue);
            currentValue++;
            quantityInput.value = currentValue;
            console.log('Value increased to:', currentValue);
        });

        // Handle direct input changes
        quantityInput.addEventListener('change', function () {
            let value = parseInt(this.value) || 1;
            console.log('Input changed to:', value);
            if (value < 1) value = 1;
            this.value = value;
            console.log('Final input value:', value);
        });

        // Buy Now button click
        buyNowBtn.addEventListener('click', function () {
            console.log('Buy Now clicked');
            const quantity = parseInt(quantityInput.value) || 1;
            console.log('Current quantity to set:', quantity);

            function findButtonInIframe() {
                const iframes = document.querySelectorAll('iframe');
                console.log('Found', iframes.length, 'iframes');

                for (let iframe of iframes) {
                    try {
                        console.log('Checking iframe:', iframe.name);

                        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                        console.log('Successfully accessed iframe document');

                        // Try to find quantity input
                        const iframeQuantityInput = iframeDoc.querySelector('input[type="number"], input[name="quantity"]');
                        console.log('Found quantity input:', iframeQuantityInput);

                        if (iframeQuantityInput) {
                            console.log('Current iframe quantity value:', iframeQuantityInput.value);
                            console.log('Setting quantity to:', quantity);

                            // Update the quantity
                            iframeQuantityInput.value = quantity;
                            iframeQuantityInput.setAttribute('value', quantity);

                            // Dispatch events
                            ['input', 'change', 'blur'].forEach(eventType => {
                                console.log('Dispatching', eventType, 'event');
                                iframeQuantityInput.dispatchEvent(new Event(eventType, { bubbles: true }));
                            });

                            console.log('New iframe quantity value:', iframeQuantityInput.value);

                            // Look for the button
                            const button = iframeDoc.querySelector('.shopify-buy__btn, [data-element="product.button"]');
                            console.log('Found button:', button);

                            if (button) {
                                console.log('Clicking button...');
                                setTimeout(() => {
                                    button.click();
                                }, 100);
                                return true;
                            }
                        }
                    } catch (e) {
                        console.log('Error with iframe:', e);
                    }
                }

                console.log('No success, retrying...');
                setTimeout(findButtonInIframe, 500);
            }

            findButtonInIframe();
        });
    }

    initializeControls();
});