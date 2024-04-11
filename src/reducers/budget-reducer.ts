import { Category, DraftExpense, Expense } from "../types"
import { v4 as uuidv4 } from 'uuid'

export type BudgetActions = 
    { type: 'add-budget', payload: { budget: number } } |
    { type: 'show-modal' } |
    { type: 'close-modal' } |
    { type: 'add-expense', payload: { expense: DraftExpense } } |
    { type: 'remove-expense', payload: {id: Expense['id']} } |
    { type: 'get-expense-by-id', payload: { id: Expense['id'] } } |
    { type: 'update-expense', payload: { expense: Expense } } |
    { type: 'reset-app' } |
    { type: 'findByCategory', payload: { id: Category['id'] } }

export type BudgetState = {
    budget: number
    modal: boolean
    expenses: Expense[]
    editingId: Expense['id']
    currentCategory: Category['id']
}

const initialBudget = () : number => {
    const lsBudget = localStorage.getItem('budget')
    return lsBudget ? +lsBudget : 0
}

const lsExpenses = (): Expense[] => {
    const lsExpenses = localStorage.getItem('expenses')
    return lsExpenses ? JSON.parse(lsExpenses) : []
}

export const initialState : BudgetState = {
    budget: initialBudget(),
    modal: false,
    expenses: lsExpenses(),
    editingId: '',
    currentCategory: ''
}

const createExpense = (draftExpense: DraftExpense): Expense => {
    return {
        ...draftExpense,
        id: uuidv4()
    }
} 

export const budgetReducer = (
    state: BudgetState = initialState,
    action: BudgetActions
): BudgetState => {

    if(action.type === 'add-budget'){

        return {
            ...state,
            budget: action.payload.budget
        }
    }

    if(action.type === 'show-modal'){
        return {
            ...state,
            modal: true,
            
        }
    }

    if(action.type === 'close-modal'){
        return {
            ...state,
            modal: false,
            editingId: ''
        }
    }

    if(action.type === 'add-expense'){

        const expense = createExpense(action.payload.expense)
        return {
            ...state,
            expenses: [...state.expenses, expense],
            modal: false,
        }
    }

    if(action.type === 'remove-expense'){
        return {
            ...state,
            expenses: state.expenses.filter(exp => exp.id !== action.payload.id)
        }
    }

    if(action.type === 'get-expense-by-id'){
        return {
            ...state,
            editingId: action.payload.id,
            modal: true,
        }
    }

    if(action.type === 'update-expense'){
        return {
            ...state,
            expenses: state.expenses.map(exp => exp.id === action.payload.expense.id ? action.payload.expense : exp),
            modal: false,
            editingId: ''
        }
    }

    if(action.type === 'reset-app'){
        return  {
            ...state,
            expenses: [],
            budget: 0
        }
    }

    if(action.type === 'findByCategory'){
        return {
            ...state,
            currentCategory: action.payload.id
        }
    }

    return state
}