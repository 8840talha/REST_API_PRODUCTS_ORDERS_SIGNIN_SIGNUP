const productSchema = require('../../models/product')
var mongoose = require('mongoose')


exports.get_all_products = (req, res) => {
    productSchema.find()
        .select('productImage _id name price')
        .exec()
        .then(docs => {
            console.log(docs)
            if (docs.length > 0) {
                res.status(200).json({
                    count: docs.length,
                    products: docs.map(doc => {
                        console.log(doc)
                        return {
                            name: doc.name,
                            price: doc.price,
                            _id: doc._id,
                            productImage: doc.productImage
                        }
                    }),
                    message: 'Found ALL THE Products'
                })
            } else {
                res.status(200).json({
                    products: docs,
                    message: 'No Enteries Found'
                })
            }

        }).catch(err => {
            res.status(500).json({ error: err })
        })

}
exports.create_product = (req, res) => {
    console.log(req.file)
    console.log(req.body)
    var newProduct = new productSchema({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    })

    newProduct.save()
        .then(result => {
            console.log(result)
            res.status(201).json({
                message: 'Post Req Successful',
                createdProduct: result,

            })

        }).catch(err => {
            res.status(500).json({
                error: err
            })
        });

}

exports.delete_all = (req, res) => {
    productSchema.deleteMany().exec()
        .then(result => {
            res.status(200).json({
                message: 'SuccessFully Deleted All products',
                deletedITems: result
            })
        }).catch(err => res.status(500).json({ error: err }))
}

exports.get_One = (req, res) => {
    productSchema.findById({ _id: req.params.prodId })
        .exec()
        .then(foundProduct => {
            if (foundProduct) {
                res.status(201).json({ dataFound: foundProduct })
            } else {
                res.status(404).json({ message: 'No Data Found for corresponding id' })
            }

        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}
exports.delete_One = (req, res) => {
    productSchema.deleteOne({ _id: req.params.productId })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'deleted this Products',
                deletedItems: result
            })
        }).catch(err => {
            res.status(500).json({
                error: err
            })
        })
}
exports.edit_One = (req, res) => {

    productSchema.update({ _id: req.params.prodId }, { name: req.body.name, price: req.body.price })

        .exec()
        .then(result => {
            res.status(200).json({ message: 'update successfull', result: result })
        }).catch(err => res.status(500).json({ error: err }))
}

exports.patch_data = (req, res) => {
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    productSchema.update({ _id: req.params.prodId }, { $set: updateOps })
        .exec().then(result => {
            res.status(200).json({
                result: result,
                message: 'Update Success Full'
            }).catch(err => res.status(500).json({ error: er }))
        })


}
