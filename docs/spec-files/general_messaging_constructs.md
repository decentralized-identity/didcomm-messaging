## General Messaging Constructs

* Decorators (headers)
* Threading
* Message types / families
* Reliable Delivery
* Attachment/Payload Signatures
* Timing
* ACKs
* Errors
* Tracing / troubleshooting

## Goal Codes

Goal codes are used to coordinate the purpose of an interaction. Some protocols are generic enough to be used for different purposes, and goal codes are a mechanism to communicate the purpose of an interaction in that situation. They are used in Out of Band messages for that reason.

Goal codes may also be used to signal a set of protocols or other mechanisms. This is often useful for interoperability profiles.

In order to avoid collision between different efforts and goal codes, goal codes defined outside of this spec MUST use Reverse Domain Notation with the associated effort's domain, such as com.example.category.specific, where any structure after the domain name portion is acceptable. 

