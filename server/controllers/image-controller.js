import User from "../models/user-model.js";
import formData from "form-data";
import axios from "axios";


export const generateImage = async (req, res) => {
    try {
        const { userId, prompt } = req.body;

        const user = await User.findById(userId);

        if (!user || !prompt) {
            return res.status(404).json({ success: false, msg: "Missing Details" })
        }

        // check credit balance
        if (user.creditBalance === 0 || user.creditBalance < 0) {
            return res.status(404).json({ success: false, msg: "No credit balance" })
        }

        const formDataObj = new formData();
        formDataObj.append('prompt', prompt);

        // send request to openai api

        const { data } = await axios.post('https://clipdrop-api.co/text-to-image/v1', formDataObj,
            {
                headers: {
                    'x-api-key': process.env.CLIPDROP_API_KEY,
                },
                responseType: 'arraybuffer'
            });

        const base64Image = Buffer.from(data, 'binary').toString('base64');

        const resultImage = `data:image/png;base64,${base64Image}`;

        // deduct user credit;

        user.creditBalance = user.creditBalance === 0 ? 0 : user.creditBalance - 1;
        await user.save();

        return res.status(200).json({ success: true, msg: "Image generated successfully", image: resultImage, credits: user.creditBalance - 1 })

    } catch (error) {
        console.log("error", error);
        return res.status(500).json({ success: false, msg: `Something went wrong -> ${error.message}` })

    }
}