const asyncHandler = (requestHandler) => {
    (req, res, next)=>{
        Promise.resolve(requestHandler(req,res,next)).catch((err) => next(err))
    }
}

// const asynchandler = () => {}
// const asynchandler = (fn) => {}
// const asynchandler = (fn) => {() => {}}
// remove brackets

// const asyncHandler = (fn) => async (error, req, res, next) => {
//     try {
//         await fn(req,res,next) 
//     } catch (error) {
//         req.status(err.code || 500).json({
//             success: false,
//             message: err.message
//         })
//     }
// }
    
const asynchandler = (fn) => async(error, req, res, next) => {
    try {
        await fn(req, res, next)
    } catch (error) {
        req.status(err.code || 500).json({
            success: false,
            message: err.message
        })
    }
}

export {asyncHandler}