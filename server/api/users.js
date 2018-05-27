import { Router } from "express";

const router = Router();

router.post("/user", function(req, res, next) {
	let { email } = req.body;
	console.log(email);
	setTimeout(() => {
		res.json({
			email
		});
	}, 2000);
});


export default router;
