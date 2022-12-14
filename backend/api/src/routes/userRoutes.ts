import { Request, Response, NextFunction } from "express";
import User from "../models/user";
import bcrypt from 'bcrypt-nodejs';
import { SECRETKEY } from '../config/config';
import * as jwt from 'jsonwebtoken';
import '../auth/passportHandler';

// Register new user
export const registerUser = (req: Request, res: Response) => {
    // Using Bcrypt to encrypt the password
    const hashedPassword = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    
    // Create new user object
    const user = new User({
        username: req.body.username,
        password: hashedPassword,
        ytunnus: req.body.ytunnus,
        email: req.body.email,
        tilinumero: req.body.tilinumero
    });
    
    // Does user exist already?
    const result = User.findOne({username: req.body.username}, (err: any, result: any) => {
        if (err) {
          res.send(err);
        } 
        if (!result){
            // User not found, create it            
            user.save((err: any, user: any) => {
                if (err){
                    res.send(err)
                }else {
                    const token = jwt.sign({
                        username: req.body.username,
                        scope: req.body.scope
                    }, SECRETKEY);
                    res.send({

                        message: '1 User created successfully.',
                        token: token
                    });
                }
            })            
        }
        else {
          res.send({
              // User already exists
              message: "User already exists"
          });
        }
      });
}

// Login user
export const authenticateUser = (req: Request, res: Response) => {
    // Check if user exists
    const result = User.findOne({username: req.body.username}, (err: any, result:any)=>{
        if (!result){
            return res.status(404).json({
                message: 'User not found'
            })
        }

        // Check if user password is correct
        const passwordIsvalid  = bcrypt.compareSync(req.body.password, result.password);
        
        // Not valid
        if (!passwordIsvalid){
            return res.status(401).json({
                token: null,
                message: "Invalid password"
            });
        }

        // Everything is ok, sign the token
        const token = jwt.sign({
            username: result.username
        }, SECRETKEY);
        res.status(200).send({
            username: result.username,
            token: token,
            ytunnus: result.ytunnus,
            email: result.email,
            tilinumero: result.tilinumero
        });
    });

};

export const deleteUser = (req: Request, res: Response) => {
    
    const user = User.findOne({_id: req.params.id}, (err: any) => {
        if (err){
            console.log('1');
            res.status(500).end();
        }else{
            User.deleteOne({_id: req.params.id}, (err: any, result: any) => {
                if (err){
                    console.log('2');
                    console.log(result);
                    res.status(500).end();
                } else{
                    console.log('3');
                    console.log(result);
                    res.status(200).end();
                }
            });

        }
    });
}



export const getUser = (req: Request, res: Response) =>{
    const user = User.findOne({_id: req.params.id }, (err: any) => {
        if (err){
            res.status(500).end();
        }
        else{ 
            res.status(200).send(user);
            
        }
    })
}