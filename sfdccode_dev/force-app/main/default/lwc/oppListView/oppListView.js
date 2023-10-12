import { LightningElement } from 'lwc';

const colums = [
    { label: 'oppportunity Name' , fieldName: 'Name' , type: 'url' ,typeAttributes: { label: {fieldName:'Name'}, target:'__blank'}},
    { label: 'Account Name' , fieldName: 'AccountName', type: 'text', typeAttributes: { label: {fieldName:'AccountName'}, target: '__blank'}},
    { label: 'Amount' , fieldName:'Amount', type: 'text', type: 'text',typeAttributes: { label: {fieldNmae: 'Amount'},  target:'__blank'}},
    { label: 'Close Date', fieldName: 'CloseDate', type: 'text', typeAttributes: { label: {fieldName: 'ClseDate'}, target:'__blank'}},
]

export default class OppListView extends LightningElement {}