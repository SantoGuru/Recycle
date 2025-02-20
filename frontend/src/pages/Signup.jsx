import { Form } from 'react-router-dom';
import Input from '../components/Input';

export default function Signup(){
    return (
        <section className="flex flex-col justify-center items-center h-screen">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Criar Nova Conta</h1>
        <p className="text-gray-600">Preencha os dados abaixo para começar</p>
  
        <div className='bg-white rounded-lg shadow-xl p-8'>
        {/* Formulario, mover para outro componente futuramente */}
        <Form method='POST' className='space-y-6'>
        {/* Input: label e input juntos para facilitar replicação*/}
            <Input 
            required
            label="Nome"
            name="name"
            id="name"
            type="text"
            placeholder="Digite seu nome..."
            />
            <Input
            required
            label="E-mail" 
            name="email"
            id="email" 
            placeholder="Digite seu e-mail..."
            type="email" 
            />
            <Input
            label="Senha" 
            name="password"
            id="password"
            type="password"
            placeholder="Digite sua nova senha..." 
            />
            <Input
            label="Confirmar Senha" 
            name="confirmPassword"
            id="confirmPassword"
            type="password"
            placeholder="Confirme sua nova senha..." 
            />
            <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
                Criar conta
            </button>
        </Form>
        </div>

      </section>
    )
}