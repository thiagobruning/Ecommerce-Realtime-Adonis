'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')
const CouponTransformer = use('App/Transformers/Admin/CouponTransformer')

class DiscountTransformer extends BumblebeeTransformer {

  static get defaultInclude()
  {
    return ['coupon']
  }

  transform (model) {
    return {
      id: model.id,
      amount: model.discount
    }
  }

  includeCoupon(discount) {
    return this.item(discount.getRelated('coupon'), CouponTransformer)
  }
}

module.exports = DiscountTransformer
