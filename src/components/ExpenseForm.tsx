import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { categories } from "../data/categories";
import DatePicker from "react-date-picker";
import 'react-calendar/dist/Calendar.css'
import 'react-date-picker/dist/DatePicker.css'
import { DraftExpense, Value } from "../types";
import ErrorMessage from "./ErrorMessage";
import { useBudget } from "../hooks/useBudget";
import { formatCurrency } from "../helpers";


export default function ExpenseForm() {
    const [ expense, setExpense ] = useState<DraftExpense>({
        amount: 0,
        expenseName: '',
        category: '',
        date: new Date()
    })

    const [ error, setError ] = useState('')
    const { state, dispatch, remainingBudget } = useBudget()
    const [previousAmount, setPreviousAmount ] = useState(0)

    useEffect(() => {
        if(state.editingId){
            const editingExpense = state.expenses.filter(exp => exp.id === state.editingId)[0]

            setExpense(editingExpense)
            setPreviousAmount(editingExpense.amount)
        }
    }, [state.editingId])

    const handleChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
        const {name, value} = e.target

        const isAmountField = ['amount'].includes(name)

        setExpense({
            ...expense,
            [name] : isAmountField ? +value : value
        })
    }
    const handleChangeDate = (value: Value) => {
        setExpense({
            ...expense,
            date: value
        })
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        //validar
        if(Object.values(expense).includes('')){
            setError('Todos los campos son obligatorios')
            return
        }
          

        // Validar que no se pase el limite
        if((expense.amount - previousAmount) > remainingBudget){
            setError(`Ese gasto supera tu presupuesto, tu presupuesto actual es ${formatCurrency(remainingBudget)}`)
            return
        } 

                    // Agregar un nuevo gasto
        if(state.editingId){
            dispatch({ type: 'update-expense', payload: { expense: {id: state.editingId, ...expense} } })
        } else {
            dispatch({type: 'add-expense', payload: { expense }})
        }
        

        // Reiniciar el state
        setExpense({
            amount: 0,
        expenseName: '',
        category: '',
        date: new Date()
        })
        setPreviousAmount(0)
        }


    
  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
        <legend className="uppercase text-center text-2xl font-black border-b-4 border-blue-500 py-2">
            {state.editingId ? 'Editar Gasto' : 'Nuevo Gasto'}
        </legend>

        { error && <ErrorMessage>{error}</ErrorMessage> }

        <div className="flex flex-col gap-2">
            <label className="text-xl" htmlFor="expenseName">
                Nombre Gasto:
            </label>
            <input type="text" id="expenseName" placeholder="Añade el nombre del gasto" className="bg-slate-100 p-2"
            name="expenseName" value={expense.expenseName} onChange={handleChange}/>
        </div>

        <div className="flex flex-col gap-2">
            <label className="text-xl" htmlFor="amount">
                Cantidad:
            </label>
            <input type="number" id="amount" placeholder="Añade la cantidad del gasto: ej. 300" className="bg-slate-100 p-2"
            name="amount" value={expense.amount} onChange={handleChange}/>
        </div>

        <div className="flex flex-col gap-2">
            <label className="text-xl" htmlFor="category">
                Categoria:
            </label>
            <select id="category" className="bg-slate-100 p-2"
            name="category" value={expense.category} onChange={handleChange}>
                <option value="">-- Seleccione --</option>
                { categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                )) }
            </select>   
        </div>

        <div className="flex flex-col gap-2">
            <label className="text-xl" htmlFor="amount">
                Fecha Gasto:
            </label>
            <DatePicker
                className='bg-slate-100 p-2 border-0'
                value={expense.date}
                onChange={handleChangeDate}
            />
        </div>

        <input type="submit" className="bg-blue-600 cursor-pointer w-full p-2 text-white uppercase font-bold rounded-lg" value={state.editingId ? 'Guardar Cambios': 'Agregar Gasto'}/>
    </form>
  )
}
