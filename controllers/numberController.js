import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { NumberModel } from "../models/numberSchema.js";
import ErrorHandler from "../middlewares/error.js";
import axios from "axios";

const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzE3MjE4NDQxLCJpYXQiOjE3MTcyMTgxNDEsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjhhZmUxNjE2LTBhZTQtNGIwOC04NjMxLTE0MDA0YzRjZjQzZCIsInN1YiI6ImFsa2EuMjEyNWNzbWUxMDE4QGtpZXQuZWR1In0sImNvbXBhbnlOYW1lIjoiS0lFVCBHcm91cCBPZiBJbnN0aXR1dGlvbnMiLCJjbGllbnRJRCI6IjhhZmUxNjE2LTBhZTQtNGIwOC04NjMxLTE0MDA0YzRjZjQzZCIsImNsaWVudFNlY3JldCI6InBWZ2dOR0FScXVSUGZOaFQiLCJvd25lck5hbWUiOiJhbGthIGd1cHRhIiwib3duZXJFbWFpbCI6ImFsa2EuMjEyNWNzbWUxMDE4QGtpZXQuZWR1Iiwicm9sbE5vIjoiMjEwMDI5MTUzMDAwNyJ9.jEOdhVfAipd1lSZvx2AIRdOB07hfzkBkoqR3z4kTPJA"

export const fetchNumbers = catchAsyncErrors(async(req, res, next) => {
    const {numberid} = req.params;
    if(!['p', 'f', 'e', 'r'].includes(numberid)){
        return res.status(400).json({error: "Invalid Numberid"});
    }
    try{
        const response = await axios.get('http://localhost:4000/numbers/p', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        const numbers = response.data.numbers;
        numbers.forEach(async num => {
            await NumberModel.findOneAndUpdate(
                {number: num},
                {number: num},
                {upsert: true, new : true}
            )
        })
        const numsArray = await NumberModel.find({}).sort({_id: -1}).limit(10);
        const sum = numsArray.reduce((acc, curr) => acc + curr.number, 0);
        const avg = sum / numsArray.length;
        const responseData = {
            numbers: numbers,
            windowPrevState: [],
            windowCurrState: numsArray.map(obj => obj.number),
            avg: parseFloat(avg.toFixed(2)),
        }
        res.json(responseData);
    }catch(error){
        console.error(error);
        res.status(500).json({error: "Error occured"});
    }
    
})