import orderView from '../views/order.art'
import httpModel from '../models/http'
const order = async (req, res, next) => {
    res.render(orderView())
}

export default order