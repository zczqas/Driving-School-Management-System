from fastapi import HTTPException, status
import requests
import json
from datetime import datetime


def charge_credit_card(
    amount,
    # cardholder_name,
    card_number,
    expiration_date,
    cvv,
    api_login_id,
    transaction_key,
    api_type,
):
    if api_type == "PRODUCTION":
        url = "https://api.authorize.net/xml/v1/request.api"
    else:
        url = "https://apitest.authorize.net/xml/v1/request.api"

    payload = {
        "createTransactionRequest": {
            "merchantAuthentication": {
                "name": api_login_id,
                "transactionKey": transaction_key,
            },
            "refId": f"REF_{datetime.now().strftime('%Y%m%d%H%M%S')}",
            "transactionRequest": {
                "transactionType": "authCaptureTransaction",
                "amount": str(amount),
                "payment": {
                    "creditCard": {
                        "cardNumber": card_number,
                        "expirationDate": expiration_date,
                        "cardCode": cvv,
                    }
                },
            },
            # "userFields": {
            #     "userField": [
            #         {
            #             "name": cardholder_name,
            #         }
            #     ]
            # },
        }
    }

    headers = {"Content-Type": "application/json"}

    response = requests.post(
        url, data=json.dumps(payload), headers=headers, timeout=100
    )

    if response.status_code == 200:
        response_content = response.content.decode("utf-8-sig")
        result = json.loads(response_content)
        if result["messages"]["resultCode"] == "Ok":
            return result["transactionResponse"]["transId"]
        else:
            error_text = result["messages"]["message"][0]["text"]
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"payment failed: {error_text}",
            )
    else:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"HTTP Error: {response.status_code}",
        )
