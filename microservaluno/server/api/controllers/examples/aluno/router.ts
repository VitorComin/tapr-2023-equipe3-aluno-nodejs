import express from 'express'
import controller from './alunocontroller'

export default express
    .Router()
    .get('/', controller.all)