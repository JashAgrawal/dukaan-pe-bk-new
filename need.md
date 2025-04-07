product type manage apis
physical, digital, appointment .

productReview apis

productWishlist apis

create products management apis
with variants size and other variants inventory
the feilds i know i will need is
name
description
main image
all images
type
price
selling price
discount amount
discount perc
size variants
variants
category=>productCategory
store_id
store
popularity index
order count
review count
average rating
wishlist count
inventory
tags
relatedCatalogueProductId

create catlogueproducts and its management apis
same as product schema just without relatedCatalogueProductId

i want all productsListing apis such that store_id will be commonfilter because user should only see the products of that store, order by every api should be by popularity index / ordercount whatever you seem fit .

getTopSellingProducts
getBestRatedProducts
getProductsByProductCategory
getProductByFavouriteCount
searchStoreProductsApi

//no store_id filter + but pincode filter is there so api such that only returns products matching the query of the only the stores which serve the pincode / panindia
searchProductsOverall
