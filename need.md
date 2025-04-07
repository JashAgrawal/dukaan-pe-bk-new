offer management apis

storeId, discountAmt,discountPercentage , type:amount|percentage, maxDiscount, isActive, products , isDeleted
such that each product can only be in one offer at a time .
per store only 2 offer can be active at a time .

coupon management apis
storeId, code, discountAmt, discountPercentage , type:amount|percentage, maxDiscount, isActive, products , isDeleted

implement cart management apis

my proposed
userid
storeid
items :{
type: [
{
product_id: Product,
quantity: { type: Number, default: 1 },
variant: variant
size: sizeVariant,
(details auto calculated because it can be changed)
effectivePrice: Number,
price: Number,
discountAmt: Number,
discountPercentage: Number,
couponDiscount: Number,
couponDiscountPercentage: Number,
offerDiscount: Number,
offerDiscountPercentage: Number,
},
],
}
,
coupon,
offer,
isactive,
state:"active"|"buy-now"|"pending"|"consumed"|"cancelled"
isdeleted

with apis addItemToCart,removeItemFromCart,updateProductQuantity,clearCart, applyCoupon, applyOffer,removeCoupon,removeOffer

also in all products and store api if the role of the user is buyer
then if its storelisting api i need an key with inWishlist

and if its in product listing api
i need 2 addtional keys inWishlist and quantityInCart
