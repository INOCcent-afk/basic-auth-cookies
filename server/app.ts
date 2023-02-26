import { PrismaClient, User } from "@prisma/client";
import bodyParser from "body-parser";
import express, { NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cors from "cors";

const prisma = new PrismaClient();
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.json());
app.use(cookieParser());
app.use(
	cors({
		origin: "http://localhost:3000",
		methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
		credentials: true,
	})
);

app.use(function (req, res, next) {
	res.header("Content-Type", "application/json;charset=UTF-8");
	res.header("Access-Control-Allow-Credentials", "true");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept"
	);
	next();
});

app.post("/register", async (req, res) => {
	console.log(req.body.email);
	try {
		const { email, password, name } = req.body as User;

		if (!(email && password && name)) {
			res.status(400).send("All input is required");
		}

		const oldUser = await prisma.user.findUnique({
			where: {
				email: email,
			},
		});

		if (oldUser)
			return res.status(409).send("User Already Exits. Please login");

		const encryptedPassword = await bcrypt.hash(password, 10);

		const user = await prisma.user.create({
			data: {
				email,
				name,
				password: encryptedPassword,
			},
		});

		const token = jwt.sign(
			{
				userId: user.id,
				email: user.email,
				name: user.name,
			},
			"SECREEEETT",
			{ expiresIn: "2h" }
		);

		const sanitizedUserData = (({ password, ...restObject }: User) =>
			restObject)(user);

		res.cookie("sessionId", token, { httpOnly: true });
		res.send({ success: true, data: { ...sanitizedUserData } });
	} catch (error) {
		console.log(error);
	}
});

app.post("/login", async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!(email && password)) {
			res.status(400).send("All input is required");
		}

		const user = await prisma.user.findUnique({
			where: {
				email: email,
			},
		});

		if (user && (await bcrypt.compare(password, user.password))) {
			const token = jwt.sign(
				{
					userId: user.id,
					email: user.email,
					name: user.name,
				},
				"SECREEEETT",
				{ expiresIn: "2h" }
			);

			res.cookie("sessionId", token, { httpOnly: true });

			const sanitizedUserData = (({ password, ...restObject }: User) =>
				restObject)(user);

			res.send({ success: true, data: { ...sanitizedUserData } });
		} else {
			res.status(401).send({
				success: false,
				meessage: "Invalid login credentials",
			});
		}
	} catch (error) {
		console.log(error);
	}
});

const checkToken = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const sessionId = req.cookies.sessionId;

		jwt.verify(sessionId, "SECREEEETT", (err: any, data: any) => {
			if (err) {
				res.status(401).send({ success: false, data: null });
			} else if (data.userId) {
				next();
			}
		});
	} catch (error) {}
};

// Verify user authentication
app.get("/protected", checkToken, async (req, res) => {
	try {
		res.status(200).send({ success: true, data: { ...req.body } });
	} catch (error) {}
});

app.post("/logout", async (req, res) => {
	try {
		res.clearCookie("sessionId");

		return res.status(200).send({ success: true });
	} catch (error) {
		console.log(error);
	}
});

const server = app.listen(8080, () => console.log("SERVER STARTED"));
