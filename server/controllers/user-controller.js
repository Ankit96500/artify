import User from "../models/user-model.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import { configDotenv } from "dotenv";
import Transaction from "../models/transaction-model.js";
import Razorpay from "razorpay";

var razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});


export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(404).json({ success: false, msg: "MIssing Details" });
        }


        // check user generate in db or not if
        const userExist = await User.findOne({ email });
        console.log("userExist", userExist)
        if (userExist) {
            return res.status(404).json({ success: false, msg: "User already exist" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const userData = {
            name, email, password: hashedPassword
        }
        const user = await User.create(userData);
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' })

        return res.status(200).json({ success: true, msg: "User created successfully", user: { name: user.name, credits: user.creditBalance }, token });


    } catch (error) {
        console.log("error", error);
        return res.status(500).json({ success: false, msg: `Something went wrong -> ${error.message}` })
    }
}



export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userExist = await User.findOne({ email });;
        if (!userExist) {
            return res.status(404).json({ success: false, msg: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, userExist.password);

        if (isMatch) {
            const token = jwt.sign({ id: userExist._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });
            return res.status(201).json({ success: true, msg: "Login Successfully", user: { name: userExist.name, credits: userExist.creditBalance }, token })
        } else {
            return res.status(404).json({ success: false, msg: "Password not Correct" })
        }


    } catch (error) {
        console.log("error", error);
        return res.status(500).json({ success: false, msg: `Something went wrong -> ${error}` })

    }
}


export const userCredit = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId);

        if (user) {
            return res.status(200).json({ success: true, msg: "User found", credits: user.creditBalance, user: { name: user.name } })
        }

    } catch (error) {
        console.log("error", error);
        return res.status(500).json({ success: false, msg: `Something went wrong -> ${error.message}` })

    }
}




export const paymentRazorpay = async (req, res) => {

    try {
        const { userId, planId } = req.body;

        const userData = await User.findById(userId);

        if (!userData || !planId) {
            return res.status(404).json({ success: false, msg: "Missing details" })
        }

        let credits, amount, plan, date;


        // based on switch case we handle this and payment decide

        switch (planId) {
            case 'Basic':
                plan = "Basic"
                amount = 10
                credits = 5
                break;

            case 'Advance':
                plan = "Advance"
                amount = 50
                credits = 50
                break;

            case 'Business':
                plan = "Business"
                amount = 250
                credits = 500
                break;

            default:
                return res.status(501).json({ success: false, msg: "Plan not found" })
                break;
        }

        // create transaction object to store date in db:
        date = Date.now();
        const transactionObj = {
            userId, plan, amount, credits, date
        }

        // store in database:
        const transactionData = await Transaction.create(transactionObj);

        if (!transactionData) {
            return res.status(500).json({ success: false, msg: "Transaction data not saved in database" })
        }

        const options = {
            amount: amount * 100,
            currency: process.env.CURRENCY,
            receipt: transactionData._id,
        }



        // create razorpay order for payment
        await razorpayInstance.orders.create(options, (err, order) => {
            if (!err) {
                return res.status(200).json({ success: true, order })
            }
            console.log(err)
            return res.status(500).json({ success: false, msg: "Transaction Failed during create order" })
        });



    } catch (error) {
        console.log(" error- > ", error)
        return res.status(500).json({ success: false, message: "Payment failed" })
    }

}


export const verifyRazorPayment = async (req, res) => {
    try {
        const { razorpay_order_id } = req.body;

        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);


        if (orderInfo.status === 'paid') {

            // fetch transaction from database
            const transactionData = await Transaction.findById(orderInfo.receipt);
            if (transactionData.payment) {
                return res.status(500).json({ success: false, msg: "Transaction payment has already fullfilled" })
            }
            // update credits

            // extract user
            const userData = await User.findById(transactionData.userId);

            const updatedCredits = userData.creditBalance + transactionData.credits;
            await User.findByIdAndUpdate({ _id: userData.id }, { creditBalance: updatedCredits });

            // mark payment true
            await Transaction.findByIdAndUpdate({ _id: transactionData._id }, { payment: true });

            return res.status(200).json({ success: true, msg: "Payment has successfully completed" })
        } else {
            return res.status(500).json({ success: false, msg: "Razorpay Order not extracted" })
            // update credits
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, msg: "Razorpay verify payment failed" })
    }
}













