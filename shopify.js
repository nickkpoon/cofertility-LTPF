(function () {
    var scriptURL = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js';

    function ShopifyBuyInit() {
        var client = ShopifyBuy.buildClient({
            domain: '9ir1hq-uv.myshopify.com',
            storefrontAccessToken: 'fd91556ac01f8893b8525b483ee891f7',
        });

        ShopifyBuy.UI.onReady(client).then(function (ui) {
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
            });
        });
    }

    function loadScript() {
        var script = document.createElement('script');
        script.async = true;
        script.src = scriptURL;
        script.onload = function () {
            ShopifyBuyInit();
        };
        (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(script);
    }

    if (window.ShopifyBuy) {
        if (window.ShopifyBuy.UI) {
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

    function initializeControls() {

        const minusBtn = document.querySelector('.custom-minus-btn');
        const plusBtn = document.querySelector('.custom-plus-btn');
        const quantityInput = document.querySelector('.custom-quantity');
        const buyNowBtn = document.querySelector('.custom-buy-now-btn');

        if (!minusBtn || !plusBtn || !quantityInput || !buyNowBtn) {
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

        // Minus button click
        minusBtn.addEventListener('click', function () {
            let currentValue = parseInt(quantityInput.value) || 1;
            if (currentValue > 1) {
                currentValue--;
                quantityInput.value = currentValue;
            }
        });

        // Plus button click
        plusBtn.addEventListener('click', function () {
            let currentValue = parseInt(quantityInput.value) || 1;
            currentValue++;
            quantityInput.value = currentValue;
        });

        // Handle direct input changes
        quantityInput.addEventListener('change', function () {
            let value = parseInt(this.value) || 1;
            if (value < 1) value = 1;
            this.value = value;
        });

        // Buy Now button click
        buyNowBtn.addEventListener('click', function () {
            const quantity = parseInt(quantityInput.value) || 1;

            function findButtonInIframe() {
                const iframes = document.querySelectorAll('iframe');

                for (let iframe of iframes) {
                    try {

                        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

                        // Try to find quantity input
                        const iframeQuantityInput = iframeDoc.querySelector('input[type="number"], input[name="quantity"]');

                        if (iframeQuantityInput) {

                            // Update the quantity
                            iframeQuantityInput.value = quantity;
                            iframeQuantityInput.setAttribute('value', quantity);

                            // Dispatch events
                            ['input', 'change', 'blur'].forEach(eventType => {
                                iframeQuantityInput.dispatchEvent(new Event(eventType, { bubbles: true }));
                            });


                            // Look for the button
                            const button = iframeDoc.querySelector('.shopify-buy__btn, [data-element="product.button"]');

                            if (button) {
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