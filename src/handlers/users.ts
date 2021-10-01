import express, { Request, Response } from 'express'
import { User, UserStore } from '../models/user'

const store = new UserStore()


