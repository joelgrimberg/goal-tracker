// import { z } from "zod";

// const schema = z.object({
//   name: z.string().nonempty("Name is required"),
// });

export default async function handler(req, res) {
  try {
    const parsed = req.body;
    console.log(parsed);
    res.status(200).json({ message: "Data received successfully" });
  } catch (error) {
    res.status(400).json({ error: error.errors });
  }
}
