const express = require('express')
const route = express.Router();
const databaseProduct = require('../../database/models2');
const IssueDatabase = require('../../database/model_issue');


route.get('/',(req,res)=>{
//    Show all the Products listed -
        databaseProduct.Product.findAll({
            where: {

            }
        }).then((results)=>{
        //    We will get all the Products whose issued value is false -
            //
            res.send(results);
        }).catch((err)=> console.error(err))
})

route.get('/unissued',(req,res)=>{
    //    Show all the Products which are not issued yet -
    databaseProduct.Product.findAll({
        where: {
            issued: false
        }
    }).then((results)=>{
        //    We will get all the Products whose issued value is false -
        //
       return res.send(results);
    }).catch((err)=> console.error(err))
})



//The post request used to find the Remaining quantity of the Product - Selected -'
route.get('/:id',(req,res)=>{
    //Need to return the product Details and the remaining quantity of the Product
    IssueDatabase.IssuedLab.findOne({
        where: {
            productPid : req.params.id
        },
        include: [{
            model: databaseProduct.Product
        }]
    }).then((result)=>{
        console.log(result.product)
        IssueDatabase.IssuedDepartment.findOne({
            where:{
               productPid: req.params.id
            },
        }).then((result2)=>{
            //Both the results are Configured - Return the remaining Quanty of the product
            console.log('Results Of 1st Query - ')
            console.log(result2)
            let remaining_quantity = result.product.qty - result2.qty - result.qty
            res.send({remaining_qty:remaining_quantity})

        }).catch((err)=>{
            console.log('Error in Finding Product Issued in Department')
            console.error(err)
        }).catch((err)=>{
            console.log('Error in Finding Product Issued in Lab')
            console.error(err)
        })
    })
})

function updateProduct(id,remaining_qty,cb)
{
    databaseProduct.Product.update({
        issued : true,
        where:{
            pid:id
        }
    }).then((result)=> { cb(); console.log('Product with  '+id+' Issued Successfully')})
        .catch((err) => console.error(err))
}
//Post Request , Then issue the Product To lab or Department -
route.post('/',(req,res)=>{
    //Check if the field is NULL-
    if(req.body.category==='department')
    {
        IssueDatabase.IssuedDepartment.create({
            qty: req.body.qty,
        //    Addition of Foreign Key
            departmentDno:req.body.departmentDno,
            productPid: req.body.productPid
        }).then(()=>{
            console.log('Product Issued in Department Successfully with qty - '+ req.body.qty)
            //Check - if the Product rem quantity goes to Zero - set the value of
            //issued in product to 1
            if(req.body.remquantity==0)
            updateProduct(req.body.productPid,req.body.remquantity,()=>{
                res.redirect('.')
            })

        }).catch((err)=>{
            console.log('Product cannot be issued In Department');
            console.error(err);
        })
    }
    else if(req.body.category==='lab')
    {
        IssueDatabase.IssuedLab.create({
            qty: req.body.qty,
            // productPid: req.body.id,

            //Foreign key Attributes
            labLabid:req.body.labLabid,
            productPid: req.body.productPid

        }).then(()=>{
            console.log('Product Issued in LAB  Successfully with qty - '+ req.body.qty)
            if(req.body.remquantity==0)
                updateProduct(req.body.productPid,req.body.remquantity,()=>{
                    res.redirect('.')
                })

        }).catch((err)=>{
            console.log('Product cannot be issued In Lab ');
            console.error(err);
        })
    }
})
route.post('/:id',(req,res)=>{
    //Need to return the product Details and the all the labs and department
    //To which this product is issued
    IssueDatabase.IssuedLab.findAll({
        where: {
            productPid : req.params.id
        },
        include: [{
            model: databaseProduct.Product
        }]
    }).then((results)=>{
        console.log(results[0].product)
        IssueDatabase.IssuedDepartment.findAll({
            where:{
                productPid: req.params.id
            },
        }).then((results2)=>{
            //Both the results are Configured - Return the remaining Quanty of the product
            console.log('Results Of 1st Query - ')
            console.log(results2)
            let issuedItem = {
                labs : results,
                department: results2,
                product: results[0].product
            }
            res.send(issuedItem)

        }).catch((err)=>{
            console.log('Error in Finding Product Issued in Department')
            console.error(err)
        }).catch((err)=>{
            console.log('Error in Finding Product Issued in Lab')
            console.error(err)
        })
    })
})


exports = module.exports = {
    route
}

/*

Issue Department;
qty:8
productPid:1
department:Cse
departmentDno:1



Issue Labs
qty:8
productPid:1
lab:Cse
labsLabid:1


 */