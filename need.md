add subStoreCategory and subProductCategory and its management apis in storeCategory and productCategory itself but just add an parent id map which can be null or map to self model

what i would need
getSubStoreCategories - takes parentCategoryId as query param
getSubProductCategories - takes parentCategoryId as query param

the current categories listing apis would return only the parent categories
also if i do get productsbycategory / storebycategory it would list the products/stores of all the subcategories of that category as well

also add an searchWithFilters route for store and product which would have
store listing filtered by and sorting functionalities

sorting options
popularity , price-low-to-high, price-high-to-low, nearest, discount, avgRating

filters options
query
categoryIds
tags
type
// products specific filters
maxPrice
minPrice
// stores specific filters
isOpen
isBrand
isPanIndia
pincode

also make an seeders script and populate 2-4 subCategories in each parent category
