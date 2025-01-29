function transformPackiyoToDSV(packiyoPayload) {
    return {
        "autobook": true, // Assuming all bookings are auto-booked
        "templateName": "", // No template used
        "parties": {
            "sender": {
                "address": {
                    "companyName": packiyoPayload.sender_address.company_name || "Packiyo",
                    "addressId": "AddressID123", // Static placeholder, update if required
                    "addressLine1": packiyoPayload.sender_address.address_1,
                    "city": packiyoPayload.sender_address.city,
                    "countryCode": packiyoPayload.sender_address.country_code,
                    "zipCode": packiyoPayload.sender_address.zip
                },
                "contact": {
                    "name": packiyoPayload.sender_address.name,
                    "email": packiyoPayload.sender_address.email,
                    "telephone": "+" + packiyoPayload.sender_address.phone
                }
            },
            "receiver": {
                "address": {
                    "companyName": packiyoPayload.delivery_address.company_name || "Receiver Company Inc.",
                    "addressLine1": packiyoPayload.delivery_address.address_1,
                    "city": packiyoPayload.delivery_address.city,
                    "countryCode": packiyoPayload.delivery_address.country_code,
                    "zipCode": packiyoPayload.delivery_address.zip
                },
                "contact": {
                    "name": packiyoPayload.delivery_address.name,
                    "email": packiyoPayload.delivery_address.email,
                    "telephone": "+" + packiyoPayload.delivery_address.phone
                }
            },
            "bookingParty": {
                "address": {
                    "mdm": "7759231562" // Static placeholder, update if required
                }
            }
        },
        "product": {
            "name": "Road" // Assuming Road transport
        },
        "incoterms": {
            "code": "EXW", // Defaulting to EXW
            "location": packiyoPayload.sender_address.city
        },
        "packages": packiyoPayload.packages.map(pkg => ({
            "quantity": 1, // Assuming each package is a separate unit
            "packageType": "EUR", // Default placeholder, update as needed
            "totalWeight": pkg.weight, // Using weight from Packiyo package
            "description": pkg.order_lines.map(line => line.description).join(", "),
            "shippingMarks": "" // Static placeholder
        })),
        "references": [
            {
                "value": packiyoPayload.order_number, // Use order number as reference
                "type": "ORDER_NUMBER"
            }
        ]
    };
}  

// Export the function
module.exports = transformPackiyoToDSV;