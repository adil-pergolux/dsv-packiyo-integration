const packiyoPayload = {
    "shipping_carrier_id": 1,
    "shipping_method": "Service 2",
    "order_number": "1234",
    "packages": [
        {
            "number": 1,
            "weight": 1,
            "weight_unit": "kg",
            "height": 10,
            "width": 10,
            "length": 10,
            "unit": "cm",
            "order_lines": [
                {
                    "sku": "component-1",
                    "description": "Kit Component 1",
                    "quantity": 10,
                    "hs_code": "string",
                    "country_of_origin": "US",
                    "unit_price": 0,
                    "currency": "EUR",
                    "weight": 2,
                    "weight_unit": "kg"
                },
                {
                    "sku": "component-2",
                    "description": "Kit Component 2",
                    "quantity": 15,
                    "hs_code": "string",
                    "country_of_origin": "US",
                    "unit_price": 0,
                    "currency": "EUR",
                    "weight": 3,
                    "weight_unit": "kg"
                }
            ]
        },
        {
            "number": 2,
            "weight": 1,
            "weight_unit": "kg",
            "height": 10,
            "width": 10,
            "length": 10,
            "unit": "cm",
            "order_lines": [
                {
                    "sku": "component-3",
                    "description": "Kit Component 3",
                    "quantity": 10,
                    "hs_code": null,
                    "country_of_origin": null,
                    "unit_price": 0,
                    "currency": "EUR",
                    "weight": 0,
                    "weight_unit": "kg"
                },
                {
                    "sku": "component-4",
                    "description": "Kit Component 4",
                    "quantity": 15,
                    "hs_code": null,
                    "country_of_origin": null,
                    "unit_price": 0,
                    "currency": "EUR",
                    "weight": 0,
                    "weight_unit": "kg"
                }
            ]
        }
    ],
    "sender_address": {
        "name": "Packiyo",
        "company_name": null,
        "company_number": null,
        "address_1": "4647 Marietta Street",
        "address_2": null,
        "zip": "95409",
        "city": "Santa Rosa",
        "country_code": "US",
        "state": "CA",
        "phone": "11223344556",
        "email": "setup@packiyo.com"
    },
    "delivery_address": {
        "name": "John Doe",
        "company_name": null,
        "company_number": null,
        "address_1": "1015 Philli Lane",
        "address_2": null,
        "zip": "74116",
        "city": "Tulsa",
        "country_code": "US",
        "state": "OK",
        "phone": "11223344556",
        "email": "setup@packiyo.com"
    }
}   

module.exports = packiyoPayload;