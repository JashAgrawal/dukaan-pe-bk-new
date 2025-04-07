create storeCategories management apis
name, image, popularityIndex, noOfStores

create productCategories management apis
name, image, popularityIndex, noOfProducts

also serviceType apis
physical Product, digital product, service, restaurant, infomercial

storeReview apis

storeWishlist apis

store management apis
id, name, tagline, description, owner_id, business_phone_number, business_email, full_address, city, state, country ,servicible pincodes,isPanIndia, type:serviceType , category , productCategories, logo, coverImage, mainImage, allImages, popularity_index, isBrand, isOpen, opensAt, closesAt, is_24_7, orderCount

i want all storelisting apis related to stores such that pincode will be commonfilter because user should only see the stores which serve his pincode or if store is pan india servicable, if isBrand isPanIndia is mandatory, order by every api should be by popularity index / ordercount whatever you seem fit . also include an optional isBrandParameter to fetch only brands .

getTopSellingStores
getBestRatedStores
getNearByStores
getStoresByCategory
getStoresByProductCategory
getStoresByServiceType
getStoresByFavouriteCount
searchStoresApi =>should search name, tagline, description, type, category, productCategories .
