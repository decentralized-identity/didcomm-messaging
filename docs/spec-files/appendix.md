## Appendix
This section provides test vectors of DIDComm Messages. The test vectors defined in the [Appendix C](#appendix-c-test-vectors) MIGHT be used to validate implementations of [DIDComm Messaging](.). The test vectors  MUST use the sender and recipient private keys defined in the [Appendix A](#appendix-a-secrets-for-test-vectors) to encrypt and sign DIDComm Messages. The test vectors MUST use the sender and recipient public keys defined in the [Appendix B](#appendix-b-diddocs-for-test-vectors) to decrypt DIDComm Encrypted Messages and verify signature of DIDComm Signed Messages.

### Appendix A. Secrets for Test Vectors 

This section provides the sender and recipient private keys. These keys MUST be used for encryption and signing DIDComm Messages.

#### A.1. Sender Secrets

This section defines the sender private keys. 

```json
[
   {
      "kid":"did:example:alice#key-1",
      "type":"JsonWebKey2020",
      "verificationMaterial":{
         "format":"JWK",
         "value":{
            "kty":"OKP",
            "d":"pFRUKkyzx4kHdJtFSnlPA9WzqkDT1HWV0xZ5OYZd2SY",
            "crv":"Ed25519",
            "x":"G-boxFB6vOZBu-wXkm-9Lh79I8nf9Z50cILaOgKKGww"
         }
      }
   },
   {
      "kid":"did:example:alice#key-2",
      "type":"JsonWebKey2020",
      "verificationMaterial":{
         "format":"JWK",
         "value":{
            "kty":"EC",
            "d":"7TCIdt1rhThFtWcEiLnk_COEjh1ZfQhM4bW2wz-dp4A",
            "crv":"P-256",
            "x":"2syLh57B-dGpa0F8p1JrO6JU7UUSF6j7qL-vfk1eOoY",
            "y":"BgsGtI7UPsObMRjdElxLOrgAO9JggNMjOcfzEPox18w"
         }
      }
   },
   {
      "kid":"did:example:alice#key-3",
      "type":"JsonWebKey2020",
      "verificationMaterial":{
         "format":"JWK",
         "value":{
            "kty":"EC",
            "d":"N3Hm1LXA210YVGGsXw_GklMwcLu_bMgnzDese6YQIyA",
            "crv":"secp256k1",
            "x":"aToW5EaTq5mlAf8C5ECYDSkqsJycrW-e1SQ6_GJcAOk",
            "y":"JAGX94caA21WKreXwYUaOCYTBMrqaX4KWIlsQZTHWCk"
         }
      }
   },
   {
      "kid":"did:example:alice#key-x25519-1",
      "type":"JsonWebKey2020",
      "verificationMaterial":{
         "format":"JWK",
         "value":{
            "kty":"OKP",
            "d":"r-jK2cO3taR8LQnJB1_ikLBTAnOtShJOsHXRUWT-aZA",
            "crv":"X25519",
            "x":"avH0O2Y4tqLAq8y9zpianr8ajii5m4F_mICrzNlatXs"
         }
      }
   },
   {
      "kid":"did:example:alice#key-p256-1",
      "type":"JsonWebKey2020",
      "verificationMaterial":{
         "format":"JWK",
         "value":{
            "kty":"EC",
            "d":"sB0bYtpaXyp-h17dDpMx91N3Du1AdN4z1FUq02GbmLw",
            "crv":"P-256",
            "x":"L0crjMN1g0Ih4sYAJ_nGoHUck2cloltUpUVQDhF2nHE",
            "y":"SxYgE7CmEJYi7IDhgK5jI4ZiajO8jPRZDldVhqFpYoo"
         }
      }
   },
   {
      "kid":"did:example:alice#key-p521-1",
      "type":"JsonWebKey2020",
      "verificationMaterial":{
         "format":"JWK",
         "value":{
            "kty":"EC",
            "d":"AQCQKE7rZpxPnX9RgjXxeywrAMp1fJsyFe4cir1gWj-8t8xWaM_E2qBkTTzyjbRBu-JPXHe_auT850iYmE34SkWi",
            "crv":"P-521",
            "x":"AHBEVPRhAv-WHDEvxVM9S0px9WxxwHL641Pemgk9sDdxvli9VpKCBdra5gg_4kupBDhz__AlaBgKOC_15J2Byptz",
            "y":"AciGcHJCD_yMikQvlmqpkBbVqqbg93mMVcgvXBYAQPP-u9AF7adybwZrNfHWCKAQwGF9ugd0Zhg7mLMEszIONFRk"
         }
      }
   }
]
```

#### A.2. Recipient Secrets

This section defines the recipient private keys.

```json
[
   {
      "kid ":"did:example:bob#key-x25519-1",
      "type ":"JsonWebKey2020",
      "verificationMaterial":{
         "format":"JWK",
         "value":{
            "kty":"OKP",
            "d":"b9NnuOCB0hm7YGNvaE9DMhwH_wjZA1-gWD6dA0JWdL0",
            "crv":"X25519",
            "x":"GDTrI66K0pFfO54tlCSvfjjNapIs44dzpneBgyx0S3E"
         }
      }
   },
   {
      "kid ":"did:example:bob#key-x25519-2",
      "type ":"JsonWebKey2020",
      "verificationMaterial":{
         "format":"JWK",
         "value":{
            "kty":"OKP",
            "d":"p-vteoF1gopny1HXywt76xz_uC83UUmrgszsI-ThBKk",
            "crv":"X25519",
            "x":"UT9S3F5ep16KSNBBShU2wh3qSfqYjlasZimn0mB8_VM"
         }
      }
   },
   {
      "kid ":"did:example:bob#key-x25519-3",
      "type ":"JsonWebKey2020",
      "verificationMaterial":{
         "format":"JWK",
         "value":{
            "kty":"OKP",
            "d":"f9WJeuQXEItkGM8shN4dqFr5fLQLBasHnWZ-8dPaSo0",
            "crv":"X25519",
            "x":"82k2BTUiywKv49fKLZa-WwDi8RBf0tB0M8bvSAUQ3yY"
         }
      }
   },
   {
      "kid ":"did:example:bob#key-p256-1",
      "type ":"JsonWebKey2020",
      "verificationMaterial":{
         "format":"JWK",
         "value":{
            "kty":"EC",
            "d":"PgwHnlXxt8pwR6OCTUwwWx-P51BiLkFZyqHzquKddXQ",
            "crv":"P-256",
            "x":"FQVaTOksf-XsCUrt4J1L2UGvtWaDwpboVlqbKBY2AIo",
            "y":"6XFB9PYo7dyC5ViJSO9uXNYkxTJWn0d_mqJ__ZYhcNY"
         }
      }
   },
   {
      "kid ":"did:example:bob#key-p256-2",
      "type ":"JsonWebKey2020",
      "verificationMaterial":{
         "format":"JWK",
         "value":{
            "kty":"EC",
            "d":"agKz7HS8mIwqO40Q2dwm_Zi70IdYFtonN5sZecQoxYU",
            "crv":"P-256",
            "x":"n0yBsGrwGZup9ywKhzD4KoORGicilzIUyfcXb1CSwe0",
            "y":"ov0buZJ8GHzV128jmCw1CaFbajZoFFmiJDbMrceCXIw"
         }
      }
   },
   {
      "kid ":"did:example:bob#key-p384-1",
      "type ":"JsonWebKey2020",
      "verificationMaterial":{
         "format":"JWK",
         "value":{
            "kty":"EC",
            "d":"ajqcWbYA0UDBKfAhkSkeiVjMMt8l-5rcknvEv9t_Os6M8s-HisdywvNCX4CGd_xY",
            "crv":"P-384",
            "x":"MvnE_OwKoTcJVfHyTX-DLSRhhNwlu5LNoQ5UWD9Jmgtdxp_kpjsMuTTBnxg5RF_Y",
            "y":"X_3HJBcKFQEG35PZbEOBn8u9_z8V1F9V1Kv-Vh0aSzmH-y9aOuDJUE3D4Hvmi5l7"
         }
      }
   },
   {
      "kid ":"did:example:bob#key-p384-2",
      "type ":"JsonWebKey2020",
      "verificationMaterial":{
         "format":"JWK",
         "value":{
            "kty":"EC",
            "d":"OiwhRotK188BtbQy0XBO8PljSKYI6CCD-nE_ZUzK7o81tk3imDOuQ-jrSWaIkI-T",
            "crv":"P-384",
            "x":"2x3HOTvR8e-Tu6U4UqMd1wUWsNXMD0RgIunZTMcZsS-zWOwDgsrhYVHmv3k_DjV3",
            "y":"W9LLaBjlWYcXUxOf6ECSfcXKaC3-K9z4hCoP0PS87Q_4ExMgIwxVCXUEB6nf0GDd"
         }
      }
   },
   {
      "kid ":"did:example:bob#key-p521-1",
      "type ":"JsonWebKey2020",
      "verificationMaterial":{
         "format":"JWK",
         "value":{
            "kty":"EC",
            "d":"AV5ocjvy7PkPgNrSuvCxtG70NMj6iTabvvjSLbsdd8OdI9HlXYlFR7RdBbgLUTruvaIRhjEAE9gNTH6rWUIdfuj6",
            "crv":"P-521",
            "x":"Af9O5THFENlqQbh2Ehipt1Yf4gAd9RCa3QzPktfcgUIFADMc4kAaYVViTaDOuvVS2vMS1KZe0D5kXedSXPQ3QbHi",
            "y":"ATZVigRQ7UdGsQ9j-omyff6JIeeUv3CBWYsZ0l6x3C_SYqhqVV7dEG-TafCCNiIxs8qeUiXQ8cHWVclqkH4Lo1qH"
         }
      }
   },
   {
      "kid ":"did:example:bob#key-p521-2",
      "type ":"JsonWebKey2020",
      "verificationMaterial":{
         "format":"JWK",
         "value":{
            "kty":"EC",
            "d":"ABixMEZHsyT7SRw-lY5HxdNOofTZLlwBHwPEJ3spEMC2sWN1RZQylZuvoyOBGJnPxg4-H_iVhNWf_OtgYODrYhCk",
            "crv":"P-521",
            "x":"ATp_WxCfIK_SriBoStmA0QrJc2pUR1djpen0VdpmogtnKxJbitiPq-HJXYXDKriXfVnkrl2i952MsIOMfD2j0Ots",
            "y":"AEJipR0Dc-aBZYDqN51SKHYSWs9hM58SmRY1MxgXANgZrPaq1EeGMGOjkbLMEJtBThdjXhkS5VlXMkF0cYhZELiH"
         }
      }
   }
]
```

### Appendix B. DIDDocs for Test Vectors

This section provides DIDDocs for a sender and recipient. The following DIDDocs MIGHT be used to validate implementations of the [DIDComm Messaging](.). They are also intended to test vectors defined in the [Appendix C](#appendix-c-test-vectors).

#### B.1. Sender DIDDocs 

This section defines the sender DIDDoc.

```json
{
   "@context":[
      "https://www.w3.org/ns/did/v2"
   ],
   "id":"did:example:alice",
   "authentication":[
      {
         "id":"did:example:alice#key-1",
         "type":"JsonWebKey2020",
         "controller":"did:example:alice#key-1",
         "publicKeyJwk":{
            "kty":"OKP",
            "crv":"Ed25519",
            "x":"G-boxFB6vOZBu-wXkm-9Lh79I8nf9Z50cILaOgKKGww"
         }
      },
      {
         "id":"did:example:alice#key-2",
         "type":"JsonWebKey2020",
         "controller":"did:example:alice#key-2",
         "publicKeyJwk":{
            "kty":"EC",
            "crv":"P-256",
            "x":"2syLh57B-dGpa0F8p1JrO6JU7UUSF6j7qL-vfk1eOoY",
            "y":"BgsGtI7UPsObMRjdElxLOrgAO9JggNMjOcfzEPox18w"
         }
      },
      {
         "id":"did:example:alice#key-3",
         "type":"JsonWebKey2020",
         "controller":"did:example:alice#key-3",
         "publicKeyJwk":{
            "kty":"EC",
            "crv":"secp256k1",
            "x":"aToW5EaTq5mlAf8C5ECYDSkqsJycrW-e1SQ6_GJcAOk",
            "y":"JAGX94caA21WKreXwYUaOCYTBMrqaX4KWIlsQZTHWCk"
         }
      }
   ],
   "keyAgreement":[
      {
         "id":"did:example:alice#key-x25519-1",
         "type":"JsonWebKey2020",
         "controller":"did:example:alice#key-x25519-1",
         "publicKeyJwk":{
            "kty":"OKP",
            "crv":"X25519",
            "x":"avH0O2Y4tqLAq8y9zpianr8ajii5m4F_mICrzNlatXs"
         }
      },
      {
         "id":"did:example:alice#key-p256-1",
         "type":"JsonWebKey2020",
         "controller":"did:example:alice#key-p256-1",
         "publicKeyJwk":{
            "kty":"EC",
            "crv":"P-256",
            "x":"L0crjMN1g0Ih4sYAJ_nGoHUck2cloltUpUVQDhF2nHE",
            "y":"SxYgE7CmEJYi7IDhgK5jI4ZiajO8jPRZDldVhqFpYoo"
         }
      },
      {
         "id":"did:example:alice#key-p521-1",
         "type":"JsonWebKey2020",
         "controller":"did:example:alice#key-p521-1",
         "publicKeyJwk":{
            "kty":"EC",
            "crv":"P-521",
            "x":"AHBEVPRhAv-WHDEvxVM9S0px9WxxwHL641Pemgk9sDdxvli9VpKCBdra5gg_4kupBDhz__AlaBgKOC_15J2Byptz",
            "y":"AciGcHJCD_yMikQvlmqpkBbVqqbg93mMVcgvXBYAQPP-u9AF7adybwZrNfHWCKAQwGF9ugd0Zhg7mLMEszIONFRk"
         }
      }
   ]
}
```

#### B.2. Sender DIDDocs

This section defines the recipient DIDDoc.

```json
{
   "@context":[
      "https://www.w3.org/ns/did/v2"
   ],
   "id":"did:example:bob",
   "keyAgreement":[
      {
         "id":"did:example:bob#key-x25519-1",
         "type":"JsonWebKey2020",
         "controller":"did:example:bob#key-x25519-1",
         "publicKeyJwk":{
            "kty":"OKP",
            "crv":"X25519",
            "x":"GDTrI66K0pFfO54tlCSvfjjNapIs44dzpneBgyx0S3E"
         }
      },
      {
         "id":"did:example:bob#key-x25519-2",
         "type":"JsonWebKey2020",
         "controller":"did:example:bob#key-x25519-2",
         "publicKeyJwk":{
            "kty":"OKP",
            "crv":"X25519",
            "x":"UT9S3F5ep16KSNBBShU2wh3qSfqYjlasZimn0mB8_VM"
         }
      },
      {
         "id":"did:example:bob#key-x25519-3",
         "type":"JsonWebKey2020",
         "controller":"did:example:bob#key-x25519-3",
         "publicKeyJwk":{
            "kty":"OKP",
            "crv":"X25519",
            "x":"82k2BTUiywKv49fKLZa-WwDi8RBf0tB0M8bvSAUQ3yY"
         }
      },
      {
         "id":"did:example:bob#key-p256-1",
         "type":"JsonWebKey2020",
         "controller":"did:example:bob#key-p256-1",
         "publicKeyJwk":{
            "kty":"EC",
            "crv":"P-256",
            "x":"FQVaTOksf-XsCUrt4J1L2UGvtWaDwpboVlqbKBY2AIo",
            "y":"6XFB9PYo7dyC5ViJSO9uXNYkxTJWn0d_mqJ__ZYhcNY"
         }
      },
      {
         "id":"did:example:bob#key-p256-2",
         "type":"JsonWebKey2020",
         "controller":"did:example:bob#key-p256-2",
         "publicKeyJwk":{
            "kty":"EC",
            "crv":"P-256",
            "x":"n0yBsGrwGZup9ywKhzD4KoORGicilzIUyfcXb1CSwe0",
            "y":"ov0buZJ8GHzV128jmCw1CaFbajZoFFmiJDbMrceCXIw"
         }
      },
      {
         "id":"did:example:bob#key-p384-1",
         "type":"JsonWebKey2020",
         "controller":"did:example:bob#key-p384-1",
         "publicKeyJwk":{
            "kty":"EC",
            "crv":"P-384",
            "x":"MvnE_OwKoTcJVfHyTX-DLSRhhNwlu5LNoQ5UWD9Jmgtdxp_kpjsMuTTBnxg5RF_Y",
            "y":"X_3HJBcKFQEG35PZbEOBn8u9_z8V1F9V1Kv-Vh0aSzmH-y9aOuDJUE3D4Hvmi5l7"
         }
      },
      {
         "id":"did:example:bob#key-p384-2",
         "type":"JsonWebKey2020",
         "controller":"did:example:bob#key-p384-2",
         "publicKeyJwk":{
            "kty":"EC",
            "crv":"P-384",
            "x":"2x3HOTvR8e-Tu6U4UqMd1wUWsNXMD0RgIunZTMcZsS-zWOwDgsrhYVHmv3k_DjV3",
            "y":"W9LLaBjlWYcXUxOf6ECSfcXKaC3-K9z4hCoP0PS87Q_4ExMgIwxVCXUEB6nf0GDd"
         }
      },
      {
         "id":"did:example:bob#key-p521-1",
         "type":"JsonWebKey2020",
         "controller":"did:example:bob#key-p521-1",
         "publicKeyJwk":{
            "kty":"EC",
            "crv":"P-521",
            "x":"Af9O5THFENlqQbh2Ehipt1Yf4gAd9RCa3QzPktfcgUIFADMc4kAaYVViTaDOuvVS2vMS1KZe0D5kXedSXPQ3QbHi",
            "y":"ATZVigRQ7UdGsQ9j-omyff6JIeeUv3CBWYsZ0l6x3C_SYqhqVV7dEG-TafCCNiIxs8qeUiXQ8cHWVclqkH4Lo1qH"
         }
      },
      {
         "id":"did:example:bob#key-p521-2",
         "type":"JsonWebKey2020",
         "controller":"did:example:bob#key-p521-2",
         "publicKeyJwk":{
            "kty":"EC",
            "crv":"P-521",
            "x":"ATp_WxCfIK_SriBoStmA0QrJc2pUR1djpen0VdpmogtnKxJbitiPq-HJXYXDKriXfVnkrl2i952MsIOMfD2j0Ots",
            "y":"AEJipR0Dc-aBZYDqN51SKHYSWs9hM58SmRY1MxgXANgZrPaq1EeGMGOjkbLMEJtBThdjXhkS5VlXMkF0cYhZELiH"
         }
      }
   ]
}
```

### Appendix C. Test Vectors 

This section provides a test vectors. The following the test vectors MIGHT be used to validate implementations of [DIDComm Messaging](.). The test vectors use private keys defined in the [Appendix A](#appendix-a-secrets-for-test-vectors) and public keys defined in the [Appendix B](#appendix-b-diddocs-for-test-vectors). 

#### C.1. DIDComm Plaintext Messages

The following example defines DIDComm Plaintext message. The message is used for DIDComm Signed Messages and DIDComm Encrypted Messages. 

```json
{
   "id":"1234567890",
   "typ":"application/didcomm-plain+json",
   "type":"http://example.com/protocols/lets_do_lunch/1.0/proposal",
   "from":"did:example:alice",
   "to":[
      "did:example:bob"
   ],
   "created_time":1516269022,
   "expires_time":1516385931,
   "body":{
      "messagespecificattribute":"and its value"
   }
}
```

#### C.2 DIDComm Signed Messages

This section provides examples for DIDComm Signed Messages. Examples sign [DIDComm Plaintext Message](#c1-didcomm-plaintext-messages).

This example uses EdDSA digital signature with a curve Ed25519.

```json
{
   "payload":"eyJpZCI6IjEyMzQ1Njc4OTAiLCJ0eXAiOiJhcHBsaWNhdGlvbi9kaWRjb21tLXBsYWluK2pzb24iLCJ0eXBlIjoiaHR0cDovL2V4YW1wbGUuY29tL3Byb3RvY29scy9sZXRzX2RvX2x1bmNoLzEuMC9wcm9wb3NhbCIsImZyb20iOiJkaWQ6ZXhhbXBsZTphbGljZSIsInRvIjpbImRpZDpleGFtcGxlOmJvYiJdLCJjcmVhdGVkX3RpbWUiOjE1MTYyNjkwMjIsImV4cGlyZXNfdGltZSI6MTUxNjM4NTkzMSwiYm9keSI6eyJtZXNzYWdlc3BlY2lmaWNhdHRyaWJ1dGUiOiJhbmQgaXRzIHZhbHVlIn19",
   "signatures":[
      {
         "protected":"eyJ0eXAiOiJhcHBsaWNhdGlvbi9kaWRjb21tLXNpZ25lZCtqc29uIiwiYWxnIjoiRWREU0EifQ",
         "signature":"FW33NnvOHV0Ted9-F7GZbkia-vYAfBKtH4oBxbrttWAhBZ6UFJMxcGjL3lwOl4YohI3kyyd08LHPWNMgP2EVCQ",
         "header":{
            "kid":"did:example:alice#key-1"
         }
      }
   ]
}
```

This example uses ES256 digital signature.

```json
{
   "payload":"eyJpZCI6IjEyMzQ1Njc4OTAiLCJ0eXAiOiJhcHBsaWNhdGlvbi9kaWRjb21tLXBsYWluK2pzb24iLCJ0eXBlIjoiaHR0cDovL2V4YW1wbGUuY29tL3Byb3RvY29scy9sZXRzX2RvX2x1bmNoLzEuMC9wcm9wb3NhbCIsImZyb20iOiJkaWQ6ZXhhbXBsZTphbGljZSIsInRvIjpbImRpZDpleGFtcGxlOmJvYiJdLCJjcmVhdGVkX3RpbWUiOjE1MTYyNjkwMjIsImV4cGlyZXNfdGltZSI6MTUxNjM4NTkzMSwiYm9keSI6eyJtZXNzYWdlc3BlY2lmaWNhdHRyaWJ1dGUiOiJhbmQgaXRzIHZhbHVlIn19",
   "signatures":[
      {
         "protected":"eyJ0eXAiOiJhcHBsaWNhdGlvbi9kaWRjb21tLXNpZ25lZCtqc29uIiwiYWxnIjoiRVMyNTYifQ",
         "signature":"gcW3lVifhyR48mLHbbpnGZQuziskR5-wXf6IoBlpa9SzERfSG9I7oQ9pssmHZwbvJvyMvxskpH5oudw1W3X5Qg",
         "header":{
            "kid":"did:example:alice#key-2"
         }
      }
   ]
}
```

This example uses ES256K digital signature.

```json
{
   "payload":"eyJpZCI6IjEyMzQ1Njc4OTAiLCJ0eXAiOiJhcHBsaWNhdGlvbi9kaWRjb21tLXBsYWluK2pzb24iLCJ0eXBlIjoiaHR0cDovL2V4YW1wbGUuY29tL3Byb3RvY29scy9sZXRzX2RvX2x1bmNoLzEuMC9wcm9wb3NhbCIsImZyb20iOiJkaWQ6ZXhhbXBsZTphbGljZSIsInRvIjpbImRpZDpleGFtcGxlOmJvYiJdLCJjcmVhdGVkX3RpbWUiOjE1MTYyNjkwMjIsImV4cGlyZXNfdGltZSI6MTUxNjM4NTkzMSwiYm9keSI6eyJtZXNzYWdlc3BlY2lmaWNhdHRyaWJ1dGUiOiJhbmQgaXRzIHZhbHVlIn19",
   "signatures":[
      {
         "protected":"eyJ0eXAiOiJhcHBsaWNhdGlvbi9kaWRjb21tLXNpZ25lZCtqc29uIiwiYWxnIjoiRVMyNTZLIn0",
         "signature":"EGjhIcts6tqiJgqtxaTiTY3EUvL-_rLjn9lxaZ4eRUwa1-CS1nknZoyJWbyY5NQnUafWh5nvCtQpdpMyzH3blw",
         "header":{
            "kid":"did:example:alice#key-3"
         }
      }
   ]
}
```

#### C.3. DIDComm Encrypted Messages

This section provides examples for DIDComm Encrypted Messages. Examples encrypt the [DIDComm Plaintext Message](#c1-didcomm-plaintext-messages).

This example uses ECDH-ES key wrapping algorithm using key with X25519 elliptic curve and XC20P for content encryption of the message.

```json
{
   "ciphertext":"KWS7gJU7TbyJlcT9dPkCw-ohNigGaHSukR9MUqFM0THbCTCNkY-g5tahBFyszlKIKXs7qOtqzYyWbPou2q77XlAeYs93IhF6NvaIjyNqYklvj-OtJt9W2Pj5CLOMdsR0C30wchGoXd6wEQZY4ttbzpxYznqPmJ0b9KW6ZP-l4_DSRYe9B-1oSWMNmqMPwluKbtguC-riy356Xbu2C9ShfWmpmjz1HyJWQhZfczuwkWWlE63g26FMskIZZd_jGpEhPFHKUXCFwbuiw_Iy3R0BIzmXXdK_w7PZMMPbaxssl2UeJmLQgCAP8j8TukxV96EKa6rGgULvlo7qibjJqsS5j03bnbxkuxwbfyu3OxwgVzFWlyHbUH6p",
   "protected":"eyJlcGsiOnsia3R5IjoiT0tQIiwiY3J2IjoiWDI1NTE5IiwieCI6IkpIanNtSVJaQWFCMHpSR193TlhMVjJyUGdnRjAwaGRIYlc1cmo4ZzBJMjQifSwiYXB2IjoiTmNzdUFuclJmUEs2OUEtcmtaMEw5WFdVRzRqTXZOQzNaZzc0QlB6NTNQQSIsInR5cCI6ImFwcGxpY2F0aW9uL2RpZGNvbW0tZW5jcnlwdGVkK2pzb24iLCJlbmMiOiJYQzIwUCIsImFsZyI6IkVDREgtRVMrQTI1NktXIn0",
   "recipients":[
      {
         "encrypted_key":"3n1olyBR3nY7ZGAprOx-b7wYAKza6cvOYjNwVg3miTnbLwPP_FmE1A",
         "header":{
            "kid":"did:example:bob#key-x25519-1"
         }
      },
      {
         "encrypted_key":"j5eSzn3kCrIkhQAWPnEwrFPMW6hG0zF_y37gUvvc5gvlzsuNX4hXrQ",
         "header":{
            "kid":"did:example:bob#key-x25519-2"
         }
      },
      {
         "encrypted_key":"TEWlqlq-ao7Lbynf0oZYhxs7ZB39SUWBCK4qjqQqfeItfwmNyDm73A",
         "header":{
            "kid":"did:example:bob#key-x25519-3"
         }
      }
   ],
   "tag":"6ylC_iAs4JvDQzXeY6MuYQ",
   "iv":"ESpmcyGiZpRjc5urDela21TOOTW8Wqd1"
}
```

This example uses ECDH-ES key wrapping algorithm using key with NIST defined P-384 elliptic curve and A256CBC-HS512 for content encryption of the message.

```json
{
   "ciphertext":"HPnc9w7jK0T73Spifq_dcVJnONbT9MZ9oorDJFEBJAfmwYRqvs1rKue-udrNLTTH0qjjbeuji01xPRF5JiWyy-gSMX4LHdLhPxHxjjQCTkThY0kapofU85EjLPlI4ytbHiGcrPIezqCun4iDkmb50pwiLvL7XY1Ht6zPUUdhiV6qWoPP4qeY_8pfH74Q5u7K4TQ0uU3KP8CVZQuafrkOBbqbqpJV-lWpWIKxil44f1IT_GeIpkWvmkYxTa1MxpYBgOYa5_AUxYBumcIFP-b6g7GQUbN-1SOoP76EzxZU_louspzQ2HdEH1TzXw2LKclN8GdxD7kB0H6lZbZLT3ScDzSVSbvO1w1fXHXOeOzywuAcismmoEXQGbWZm7wJJJ2r",
   "protected":"eyJlcGsiOnsia3R5IjoiRUMiLCJjcnYiOiJQLTM4NCIsIngiOiIxNjFhZ0dlYWhHZW1IZ25qSG1RX0JfU09OeUJWZzhWTGRoVGdWNVc1NFZiYWJ5bGxpc3NuWjZXNzc5SW9VcUtyIiwieSI6ImNDZXFlRmdvYm9fY1ItWTRUc1pCWlg4dTNCa2l5TnMyYi12ZHFPcU9MeUNuVmdPMmpvN25zQV9JQzNhbnQ5T1gifSwiYXB2IjoiTEpBOUVva3M1dGFtVUZWQmFsTXdCaEo2RGtEY0o4SEs0U2xYWldxRHFubyIsInR5cCI6ImFwcGxpY2F0aW9uL2RpZGNvbW0tZW5jcnlwdGVkK2pzb24iLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwiYWxnIjoiRUNESC1FUytBMjU2S1cifQ",
   "recipients":[
      {
         "encrypted_key":"SlyWCiOaHMMH9CqSs2CHpRd2XwbueZ1-MfYgKVepXWpgmTgtsgNOAaYwV5pxK3D67HV51F-vLBFlAHke7RYp_GeGDFYhAf5s",
         "header":{
            "kid":"did:example:bob#key-p384-1"
         }
      },
      {
         "encrypted_key":"5e7ChtaRgIlV4yS4NSD7kEo0iJfFmL_BFgRh3clDKBG_QoPd1eOtFlTxFJh-spE0khoaw8vEEYTcQIg4ReeFT3uQ8aayz1oY",
         "header":{
            "kid":"did:example:bob#key-p384-2"
         }
      }
   ],
   "tag":"bkodXkuuwRbqksnQNsCM2YLy9f0v0xNgnhSUAoFGtmE",
   "iv":"aE1XaH767m7LY0JTN7RsAA"
}
```

This example uses ECDH-ES key wrapping algorithm using key with NIST defined P-521 elliptic curve and A256GCM for content encryption of the message.

```json
{
   "ciphertext":"mxnFl4s8FRsIJIBVcRLv4gj4ru5R0H3BdvyBWwXV3ILhtl_moqzx9COINGomP4ueuApuY5xdMDvRHm2mLo6N-763wjNSjAibNrqVZC-EG24jjYk7RPZ26fEW4z87LHuLTicYCD4yHqilRbRgbOCT0Db5221Kec0HDZTXLzBqVwC2UMyDF4QT6Uz3fE4f_6BXTwjD-sEgM67wWTiWbDJ3Q6WyaOL3W4ukYANDuAR05-SXVehnd3WR0FOg1hVcNRao5ekyWZw4Z2ekEB1JRof3Lh6uq46K0KXpe9Pc64UzAxEID93SoJ0EaV_Sei8CXw2aJFmZUuCf8YISWKUz6QZxRvFKUfYeflldUm9U2tY96RicWgUhuXgv",
   "protected":"eyJlcGsiOnsia3R5IjoiRUMiLCJjcnYiOiJQLTUyMSIsIngiOiJBRWtrc09abW1oZkZYdU90MHMybVdFYlVybVQ3OXc1SFRwUm9TLTZZNXpkYlk5T0I5b2RHb2hDYm1PeGpqY2VhWUU5ZnNaX3RaNmdpTGFBNUFEUnBrWE5VIiwieSI6IkFDaWJnLXZEMmFHVEpHbzlmRUl6Q1dXT2hSVUlObFg3Q1hGSTJqeDlKVDZmTzJfMGZ3SzM2WTctNHNUZTRpRVVSaHlnU1hQOW9TVFczTkdZTXVDMWlPQ3AifSwiYXB2IjoiR09lbzc2eW02TkNnOVdXTUVZZlcwZVZEVDU2Njh6RWhsMnVBSVctRS1IRSIsInR5cCI6ImFwcGxpY2F0aW9uL2RpZGNvbW0tZW5jcnlwdGVkK2pzb24iLCJlbmMiOiJBMjU2R0NNIiwiYWxnIjoiRUNESC1FUytBMjU2S1cifQ",
   "recipients":[
      {
         "encrypted_key":"W4KOy5W88iPPsDEdhkJN2krZ2QAeDxOIxW-4B21H9q89SHWexocCrw",
         "header":{
            "kid":"did:example:bob#key-p521-1"
         }
      },
      {
         "encrypted_key":"uxKPkF6-sIiEkdeJcUPJY4lvsRg_bvtLPIn7eIycxLJML2KM6-Llag",
         "header":{
            "kid":"did:example:bob#key-p521-2"
         }
      }
   ],
   "tag":"aPZeYfwht2Nx9mfURv3j3g",
   "iv":"lGKCvg2xrvi8Qa_D"
}
```

This example uses ECDH-1PU key wrapping algorithm using key with X25519 elliptic curve and A256CBC-HS512 for content encryption of the message.

```json
{
   "ciphertext":"MJezmxJ8DzUB01rMjiW6JViSaUhsZBhMvYtezkhmwts1qXWtDB63i4-FHZP6cJSyCI7eU-gqH8lBXO_UVuviWIqnIUrTRLaumanZ4q1dNKAnxNL-dHmb3coOqSvy3ZZn6W17lsVudjw7hUUpMbeMbQ5W8GokK9ZCGaaWnqAzd1ZcuGXDuemWeA8BerQsfQw_IQm-aUKancldedHSGrOjVWgozVL97MH966j3i9CJc3k9jS9xDuE0owoWVZa7SxTmhl1PDetmzLnYIIIt-peJtNYGdpd-FcYxIFycQNRUoFEr77h4GBTLbC-vqbQHJC1vW4O2LEKhnhOAVlGyDYkNbA4DSL-LMwKxenQXRARsKSIMn7z-ZIqTE-VCNj9vbtgR",
   "protected":"eyJlcGsiOnsia3R5IjoiT0tQIiwiY3J2IjoiWDI1NTE5IiwieCI6IkdGY01vcEpsamY0cExaZmNoNGFfR2hUTV9ZQWY2aU5JMWRXREd5VkNhdzAifSwiYXB2IjoiTmNzdUFuclJmUEs2OUEtcmtaMEw5WFdVRzRqTXZOQzNaZzc0QlB6NTNQQSIsInNraWQiOiJkaWQ6ZXhhbXBsZTphbGljZSNrZXkteDI1NTE5LTEiLCJhcHUiOiJaR2xrT21WNFlXMXdiR1U2WVd4cFkyVWphMlY1TFhneU5UVXhPUzB4IiwidHlwIjoiYXBwbGljYXRpb24vZGlkY29tbS1lbmNyeXB0ZWQranNvbiIsImVuYyI6IkEyNTZDQkMtSFM1MTIiLCJhbGciOiJFQ0RILTFQVStBMjU2S1cifQ",
   "recipients":[
      {
         "encrypted_key":"o0FJASHkQKhnFo_rTMHTI9qTm_m2mkJp-wv96mKyT5TP7QjBDuiQ0AMKaPI_RLLB7jpyE-Q80Mwos7CvwbMJDhIEBnk2qHVB",
         "header":{
            "kid":"did:example:bob#key-x25519-1"
         }
      },
      {
         "encrypted_key":"rYlafW0XkNd8kaXCqVbtGJ9GhwBC3lZ9AihHK4B6J6V2kT7vjbSYuIpr1IlAjvxYQOw08yqEJNIwrPpB0ouDzKqk98FVN7rK",
         "header":{
            "kid":"did:example:bob#key-x25519-2"
         }
      },
      {
         "encrypted_key":"aqfxMY2sV-njsVo-_9Ke9QbOf6hxhGrUVh_m-h_Aq530w3e_4IokChfKWG1tVJvXYv_AffY7vxj0k5aIfKZUxiNmBwC_QsNo",
         "header":{
            "kid":"did:example:bob#key-x25519-3"
         }
      }
   ],
   "tag":"uYeo7IsZjN7AnvBjUZE5lNryNENbf6_zew_VC-d4b3U",
   "iv":"o02OXDQ6_-sKz2PX_6oyJg"
}
```

In this example, the message is first signed with EdDSA digital signature and then encrypted with ECDH-1PU key wrapping algorithm using key with NIST defined P-521 elliptic curve and A256CBC-HS512 for content encryption of the message.

```json
{
   "ciphertext":"WCufCs2lMZfkxQ0JCK92lPtLFgwWk_FtRWOMj52bQISa94nEbIYqHDUohIbvLMgbSjRcJVusZO04UthDuOpSSTcV5GBi3O0cMrjyI_PZnTb1yikLXpXma1bT10D2r5TPtzRMxXF3nFsr9y0JKV1TsMtn70Df2fERx2bAGxcflmd-A2sMlSTT8b7QqPtn17Yb-pA8gr4i0Bqb2WfDzwnbfewbukpRmPA2hsEs9oLKypbniAafSpoiQjfb19oDfsYaWWXqsdjTYMflqH__DqSmW52M-SUp6or0xU0ujbHmOkRkcdh9PsR5YsPuIWAqYa2hfjz_KIrGTxvCos0DMiZ4Lh_lPIYQqBufSdFH5AGChoekFbQ1vcyIyYMFugzOHOgZ2TwEzv94GCgokBHQR4_qaU_f4Mva64KPwqOYdm5f4KX16afTJa-IV7ar7__2L-A-LyxmC5KIHeGOedV9kzZBLC7TuzRAuE3vY7pkhLB1jPE6XpTeKXldljaeOSEVcbFUQtsHOSPz9JXuhqZ1fdAx8qV7hUnSAd_YMMDR3S6SXtem8ak2m98WPvKIxhCbcto7W2qoNYMT7MPvvid-QzUvTdKtyovCvLzhyYJzMjZxmn9-EnGhZ5ITPL_xFfLyKxhSSUVz3kSwK9xuOj3KpJnrrD7xrp5FKzEaJVIHWrUW90V_9QVLjriThZ36fA3ipvs8ZJ8QSTnGAmuIQ6Z2u_r4KsjL_mGAgn47qyqRm-OSLEUE4_2qB0Q9Z7EBKakCH8VPt09hTMDR62aYZYwtmpNs9ISu0VPvFjh8UmKbFcQsVrz90-x-r-Q1fTX9JaIFcDy7aqKcI-ai3tVF_HDR60Jaiw",
   "protected":"eyJlcGsiOnsia3R5IjoiRUMiLCJjcnYiOiJQLTI1NiIsIngiOiJObHJ3UHZ0SUluZWNpeUVrYTRzMi00czhPalRidEZFQVhmTC12Z2x5enFvIiwieSI6ImhiMnZkWE5zSzVCQ2U3LVhaQ0dfLTY0R21UT19rNUlNWFBaQ00xdGFUQmcifSwiYXB2Ijoiei1McXB2VlhEYl9zR1luM21qUUxwdXUyQ1FMZXdZdVpvVFdPSVhQSDNGTSIsInNraWQiOiJkaWQ6ZXhhbXBsZTphbGljZSNrZXktcDI1Ni0xIiwiYXB1IjoiWkdsa09tVjRZVzF3YkdVNllXeHBZMlVqYTJWNUxYQXlOVFl0TVEiLCJ0eXAiOiJhcHBsaWNhdGlvbi9kaWRjb21tLWVuY3J5cHRlZCtqc29uIiwiZW5jIjoiQTI1NkNCQy1IUzUxMiIsImFsZyI6IkVDREgtMVBVK0EyNTZLVyJ9",
   "recipients":[
      {
         "encrypted_key":"ZIL6Leligq1Xps_229nlo1xB_tGxOEVoEEMF-XTOltI0QXjyUoq_pFQBCAnVdcWNH5bmaiuzCYOmZ9lkyXBkfHO90KkGgODG",
         "header":{
            "kid":"did:example:bob#key-p256-1"
         }
      },
      {
         "encrypted_key":"sOjs0A0typIRSshhQoiJPoM4o7YpR5LA8SSieHZzmMyIDdD8ww-4JyyQhqFYuvfS4Yt37VF4z7Nd0OjYVNRL-iqPnoJ3iCOr",
         "header":{
            "kid":"did:example:bob#key-p256-2"
         }
      }
   ],
   "tag":"nIpa3EQ29hgCkA2cBPde2HpKXK4_bvmL2x7h39rtVEc",
   "iv":"mLqi1bZLz7VwqtVVFsDiLg"
}
```

In this example, the message is first signed with EdDSA digital signature and then encrypted with ECDH-1PU key wrapping algorithm using key with X25519 elliptic curve and A256CBC-HS512 for content encryption of the message, after that the message is encrypted a second time with ECDH-ES key wrapping algorithm using key with X25519 elliptic curve and XC20P for content encryption of the message.


```json
{
   "ciphertext":"lfYmR7CNas5hOePxWQEkUEwzSRds3t5GkMW4VUZKJWJ7H3y1X8a1RnUg3c0BCqdszzhZk8xE0vfQ67vJAWGdev8OWy7oGY_e1o4iAVj3mPNfnV5N7sjld6yUhrxqDsxtmVAp7LAipbJNhxqBoEXdb8hPbdPeUIov-5X0_cQHpHalSD6zMoyUPb0cCnw8bfmdN3aaVDrzsZRIkvhezZCkaQFMO75XKVEDyTzn8Eqwgpg_tzD_Hr00jHa9mTyTiDA_1ZzqleF-XSe5NEtFc7_BukgjPWMZAouPMWwIP0h-BPULxUzYcWKfC6hiU2ZuxWz8Fs8v9r6MCAaPOG37oA_yfWwE_FWl7x61sl6iZfDVQhOTkdlXNoZ0LiaC4ImXop2wSvKimkGqhysj1OefrUrpHmSx1qNz7vCWqW8Mo7fykXQCVYr6zXmcvWF5-KvXDu6DR3EFlgs6An9tWLv1flDrZWb-lS6RlL6Z8AqmLjP0Yb2r6mTopiulTTpXXpwe-Qs1_DHDGi0DfsZmcYhyra-F8YQ3tGIgy6wWCtyBh7Fq_zRy8RMvV3DkaLHYTekIle0YOoRdZRJBb3ycXHycIi7iT1ewOFlIGjsBg73Hkqa6O1weewS3uIxl4veO6cBOksfDRpC279X9tV1HDqROBolNBsWHQ2UpUD1Bat8UnfJMrwBcZkGQCjhlR9SSlZzEIqP3leRh5e2y2FGTm7wNRNwmgl6s6OUiKD-nbUnnSugGzolbavafHS80XrdfEuUyuPjnpQQQROapFfcjd7dSLd58g9OjOEqb1-Edk4KcW-yYU17_zfIzv1qykEH7F22Nq9HGbReXuao83ItUWgpBDZ-uf-_RbcpW2X1U5QGnI1SF4Trbhx74lnswEF_AlZ4SUh7frcMfKQLYobT1X_wIEY8pwN1AzWf482LJKKsxm0EcY73vf0n3uT_OS3EgBNCVYyF6_snm7MdOV-RM5ZZyQl64BsZ4aL4RVVCOa8bxYGPxvpOf9Ay-aQjwYQfyFxayRJiQWkywk8SRAdLLfSiveqvXAoIIi_XI98CRIaJ6DSKr-TuCDlz4yVP_8emS_S0S7F-Buh-P6nzjdJ04CAm95p6do_q8jk1IRHvubqrPKcpvk4U3p-6obJK9feJPffoe3-ddJvKJ5h8Et3xEKG7oId3NkbbFfYUnkEyC_wUeKtyrXK8uBz5HKhW1S27qsBAnKv5WTCyfrDsfX0eTaqdeJ3O9uR4niBc2sa2t89G5AEKWcOUnJcytAAAuhMZiz2zXXhmffPG5A7QSmZMAl75CP6ulN0KCBE0nTeuvNPueqpF4PV4CCcMfokz0hu5k5oo9FHfkQMVDBTiQUtEezIXiglqhu6VwcDgbbatAKUIYxnoisHKPg17zGMl5VMULVY5WBYPAUylKpWELnMc9BHUHNUxfSVlqdd847v__D1Go17MTsQujVGQQuM61Ay0-z1JwN0fki0M8t20U_sWX5jNMbdZCPBxy7rpZlztaF01j1NCaM3ZPh-_KLy8vQ584R5I5LlE5OejgyLQYMOMzSgUZZEAeTGV_S-kEnt36k-L8Kbyv_LWuiuTQzwLSwlmWOKLdDbmjEjA1JsEaKmorDKz0q7MFIoC-gKKJBjPTJ5PxJLJj4RHOxxDWhx00HjLLE3S1B6uAvKVUhN4ka_wWusVqffrRZm_e7Oz0hbCO8pT4tzlbFWTu0-O44kHkRjfubEi4PnaNzKbGMXTrDo7aY6sgiDB8KlJSsKrNeG0OLjBAYF_zmHlrqctFQidTD_YIDzcSfkCTrMoOYa07nXG6E1nArScOgkNuNkPVhCq_VD6w-pZ1mSUBwKVCnjNueTrB5RvFBydaoWcAAX3OtH8yFeDWGzlRYWJNKEKull_Vah8B7nwwnTPxyeUwnr2txlwDvLx9ASrl5CjwvLc9bL7jCa6SrWt3hPjvjDY4JdFxnCqyyXD11Mpt2kyA4TTBaBbzI5Kja6pKsCUw0QCTCfTBu7bKGTOJKai32c4WRXvpVgIowOzdyjtKD0LgnY2fRTpJWpcTMVAHPfSad0jc23iTwOKcJQ0n_ExfOxzW_PSvAYbakrRwdZdDefb_fLrILxgS7OA9KepGQOJnp0-X_o1bBkXsm_cvVhcprLViUxHR1uCTMXaUl24viekps45aODvfBj5OsG3GrEShqtLb7ukEHEJjLsIe1l-4kFtNp4RlPZlapYgNyMSjnGopw2D51khuOHdJ2yLWASgFJPIa4dan4KTcDhp7qmbijN8JR_s_p1DB4E1nFlQPuncA8lIiuGv2PKHKXQkkuHcKmPMYTjRlam5IBHXQPV_njHMAIV60XU8kxa5G7t-Iwl_6OeRIj_HXdf5mfdTNEYlwbQWHInkS4U32RD9Kf0u6SC1bpRZx6AbFK8xlIgUPhB_sP3kG_ZZIZhcJ1Oy6Q7pAzmKXZYWKMkDWZk7a-WsiA0Z8gOcd7PYA13GRIw0MT_GIRcFRfkp7821j2ArHHo6jagqMdEuCZHzHrfwD0XHzT4FP3-aTaHIqrKx0TiYRfn2k2Q",
   "protected":"eyJlcGsiOnsia3R5IjoiRUMiLCJjcnYiOiJQLTUyMSIsIngiOiJBYmxoeVVENUxYNE9zWDhGRTVaODRBX09CYThiOHdhVUhXSFExbTBnczhuSFVERDdySDlJRWRZbzJUSzFQYU5ha05aSk54a1FBWC1aUkxWa1BoNnV4eTJNIiwieSI6IkFQTjh6c0xEZGJpVjN0LTloWTJFQzFVZWEzTm5tMzFtNWowRmNiUWM0Y2ZWQmFNdzVCQ2VpcU9QWkljZTVMNjI4bnVORkxKR2szSjh6SVBPYUlLU0xmaTEifSwiYXB2IjoiR09lbzc2eW02TkNnOVdXTUVZZlcwZVZEVDU2Njh6RWhsMnVBSVctRS1IRSIsInR5cCI6ImFwcGxpY2F0aW9uL2RpZGNvbW0tZW5jcnlwdGVkK2pzb24iLCJlbmMiOiJYQzIwUCIsImFsZyI6IkVDREgtRVMrQTI1NktXIn0",
   "recipients":[
      {
         "encrypted_key":"iuVx5qAiRtijMfHnkF95_ByjHyiAmRqNTrExrEQK4p7HwW7sit1F0g",
         "header":{
            "kid":"did:example:bob#key-p521-1"
         }
      },
      {
         "encrypted_key":"6OWnv-tY1ZDUBt8uRNpmteoXTVDzRGz2UF04Y2eh2-bp2jiViU8VCw",
         "header":{
            "kid":"did:example:bob#key-p521-2"
         }
      }
   ],
   "tag":"pEh6LS1GCTYQaWR-6vAe_Q",
   "iv":"ZMHYqq1xV1X81bFzzEH_iAfBcL75fznZ"
}
```