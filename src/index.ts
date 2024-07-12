import express, { Request, Response } from 'express'
import cors from 'cors'
import { accounts } from './database'
import { ACCOUNT_TYPE } from './types'

const app = express()

app.use(express.json())
app.use(cors())

app.listen(3003, () => {
    console.log("Servidor rodando na porta 3003")
})

app.get("/ping", (req: Request, res: Response) => {
    res.send("Pong!")
})

app.get("/accounts", (req: Request, res: Response) => {
    res.send(accounts)
})

app.get("/accounts/:id", (req: Request, res: Response) => {
    try {

        const id = req.params.id
        const result = accounts.find((account) => account.id === id) 
        
        if (!result) {
            throw new Error("Conta não encontrada. Verifique a ID")
        }

        res.status(200).send(result)

    } catch(error: any){
        console.log(error)
        res.status(404).send(error.message)
    }
})

app.delete("/accounts/:id", (req: Request, res: Response) => {
    try {

        const id = req.params.id
        const accountIndex = accounts.findIndex((account) => account.id === id)

        if (id[0] === "a") {
            accounts.splice(accountIndex, 1)
        } else {
            res.statusCode = 400
            throw new Error("'ID' inválida. Deve iniciar com letra 'a'.")
        }

        res.status(200).send("Item deletado com sucesso")
    }catch(error: any) {
        console.log(error)
        res.send(error.message)
    }
})

app.put("/accounts/:id", (req: Request, res: Response) => {
    try{
        const id = req.params.id

        const newId = req.body.id as string | undefined
        const newOwnerName = req.body.ownerName as string | undefined
        const newBalance = req.body.balance as number | undefined
        const newType = req.body.type as ACCOUNT_TYPE | undefined

        if (typeof newId !== "string") {
			throw new Error("'Id' deve ser uma string")
		}

        if (typeof newOwnerName !== "string") {
			throw new Error("'Name' deve ser uma string")
		}

        if (typeof newBalance !== "number") {
			throw new Error("'Balance' deve ser um number")
		}

        if (typeof newType !== "string") { // Em dúvida com o que comparar"
			throw new Error("'Type' deve ser 'Ouro', 'Platina' ou 'Black'")
		}

        const account = accounts.find((account) => account.id === id) 

        if (account) {
            account.id = newId || account.id
            account.ownerName = newOwnerName || account.ownerName
            account.type = newType || account.type

            account.balance = isNaN(newBalance) ? account.balance : newBalance
        }

        res.status(200).send("Atualização realizada com sucesso")

    }catch(error: any){
        console.log(error)
        res.status(400).send(error.message)
    }   
})