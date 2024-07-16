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

        if (id[0] !== "a") {
            res.status(404)
            throw new Error("ID deve começar com a letra 'a'.")
        }

        if (result === undefined) {
            res.status(404)
            throw new Error("Conta não encontrada. Verifique a ID")
        }

        res.status(200).send(result)

    } catch (error: any) {
        res.send(error.message)
    }
})

app.delete("/accounts/:id", (req: Request, res: Response) => {
    try {
        const id = req.params.id
        const accountIndex = accounts.findIndex((account) => account.id === id)

        if (id[0] !== "a") {
            res.status(404)
            throw new Error("ID inválido. O ID deve começar com a letra 'a'.")
        } else if (accountIndex === undefined || accountIndex < 0) {
            res.status(404)
            throw new Error("Conta não encontrada. Verifique a ID")
        } else {
            accounts.splice(accountIndex, 1)
            res.status(200).send("Item deletado com sucesso")
        }  

    } catch (error: any) {
         if (res.statusCode === 200) {
            res.status(500)
        }

        res.send(error.message)
    }
})

app.put("/accounts/:id", (req: Request, res: Response) => {
    try {
        const id = req.params.id

        const newId = req.body.id as string | undefined
        const newOwnerName = req.body.ownerName as string | undefined
        const newBalance = req.body.balance as number | undefined
        const newType = req.body.type as ACCOUNT_TYPE | undefined

        if (newId !== undefined) {
            if (typeof newId !== "string") {
                res.status(400)
                throw new Error("'Id' inválida. 'Id' deve ser uma string")
            }

            if (newId[0] !== "a") {
                res.status(404)
                throw new Error("'Id' inválida. 'Id' deve iniciar com 'a'.")
            }
        }

        if (newOwnerName !== undefined) {

            if (newOwnerName.length < 2) {
                res.status(400)
                throw new Error("'Name' deve ter no mínimo 2 caracteres")
            }

            if (typeof newOwnerName !== "string") {
                res.status(400)
                throw new Error("'Name' deve ser uma string")
            }
            
        }

        
        if (newBalance !== undefined) {

            if (typeof newBalance !== "number") {
                res.status(400)
                throw new Error("'Balance' deve ser um number")
            }

            if (newBalance < 0) {
                res.status(400)
                throw new Error("'Balance' deve ser igual ou maior que zero.")
            }
        }


        if (newType !== undefined) {
            
            if (newType !== ACCOUNT_TYPE.GOLD &&
                newType !== ACCOUNT_TYPE.PLATINUM &&
                newType !== ACCOUNT_TYPE.BLACK
             ){
                res.status(400)
                throw new Error("'Type' deve ser 'Ouro', 'Platina' ou 'Black'")
            }
        }

        const account = accounts.find((account) => account.id === id)

        if (account) {
            account.id = newId || account.id
            account.ownerName = newOwnerName || account.ownerName
            account.type = newType || account.type
            account.balance = newBalance || account.balance
        }

        res.status(200).send("Atualização realizada com sucesso")

    } catch (error: any) {
       
        if (res.statusCode === 200) {
            res.status(500)
        }

        res.send(error.message)
    }
})