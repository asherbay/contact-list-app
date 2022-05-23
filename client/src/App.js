import React, {useEffect, useState} from 'react'
import axios from 'axios'
import styled from 'styled-components'

const App = () => {

  const [backendData, setBackendData] = useState("")
  const [expandedContact, setExpandedContact] = useState(null)
  const [newContact, setNewContact] = useState(false)


  useEffect(()=>{
    getContacts()
  }, [])

  useEffect(()=>{
    console.log('backend: ' + backendData)
  }, [backendData])

  useEffect(()=>{
    console.log('exp contact: ' + expandedContact)
  }, [expandedContact])

  const validateEmail = (email) => {
    let res = String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
      if(!res){
        alert("invalid email")
      }
      return res
  };

  const validateNumber = (number) => {
    let res = String(number)
      .toLowerCase()
      .match(
        /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
      );
      if(!res){
        alert("invalid phone number")
      } else {
        console.log('valid phone number')
      }
      return res


  }


  const getContacts = async () => {
    let res = await axios.get('/contacts')
    console.log(res.data)
    setBackendData(res.data)
  }

  const NewContact = () => {
    const [open, setOpen] = useState(false)
    const [newName, setNewName] = useState("")
    const [newNumber, setNewNumber] = useState("")
    const [newEmail, setNewEmail] = useState("")

    const handleAdd = async () => {
      let newContact = {name: newName, number: newNumber, email: newEmail, id: backendData.contacts.length}

      await axios.post('/contacts', newContact)
      getContacts()
    }

    return (
          <div style={{display: "flex", gap: "10px", alignItems: "start", flexDirection: "column"}}>
            <Field value={newName} onChange={(e)=>{setNewName(e.target.value)}}/>
            <Field value={newNumber} onChange={(e)=>{setNewNumber(e.target.value)}}/>
            <Field value={newEmail} onChange={(e)=>{setNewEmail(e.target.value)}}/>
          </div>

    )
  }



  const Details = (props) => {

    const [editing, setEditing] = useState(false)
    const [newName, setNewName] = useState(props.newContact ? "" : props.contact.name )
    const [newNumber, setNewNumber] = useState(props.newContact ? "" : props.contact.number)
    const [newEmail, setNewEmail] = useState(props.newContact ? "" : props.contact.email)

    useEffect(()=>{
        console.log("editing: " + editing)

    }, [editing])

    

    const handleEdit = () => {
      setEditing(!editing)
      if(editing && validateEmail(newEmail) && validateNumber(newNumber)){
        updateContact(
          {name: newName, number: newNumber, email: newEmail, id: props.contact.id}
        ) 
      }
    }

    const validateAdd = () => {
      if(validateEmail(newEmail) && validateNumber(newNumber)){
        handleAdd()
      }
    }

    const updateContact = async (data) => {
      let res = await axios.put(`/contacts/${data.id}`, data)
      console.log(res.data)
      getContacts()
      selNewContact(data)
    }

    const handleAdd = async () => {
      let newContact = {name: newName, number: newNumber, email: newEmail, id: backendData.contacts.length}

      await axios.post('/contacts', newContact)
      props.selNewContact(newContact)
      getContacts()
    }

    const handleDelete = async (data) => {
      await axios.delete(`/contacts/${data.id}`, data)
      props.selNewContact(null)
      getContacts()
    }

    return (
  
          <Sidebar>
            {(props.newContact || editing) ?
              <div style={{display: "flex", gap: "10px", alignItems: "start", flexDirection: "column"}}>
                <span>
                  Name: <Field value={newName} onChange={(e)=>{setNewName(e.target.value)}}/>
                </span>
                <span>
                  Number: <Field value={newNumber} onChange={(e)=>{setNewNumber(e.target.value)}}/>
                </span>
                <span>
                 Email: <Field value={newEmail} onChange={(e)=>{setNewEmail(e.target.value)}}/>
                </span>
              </div>
            : 
              <div style={{display: "flex", gap: "10px", alignItems: "start", flexDirection: "column"}}>
                <span>{props.contact.name}</span>
                <span>{props.contact.number}</span>
                <span>{props.contact.email}</span> 
              </div>
            }
            <div style={{display: 'flex', gap: '10px'}}>
              <button onClick={newContact ? validateAdd : handleEdit}>{newContact ? "add" : editing ? "update" : "edit"}</button>
              {(newContact || editing) && <button onClick={()=>{
                setEditing(false)
                selNewContact(props.contact)
              }}>cancel</button>}
              {(!editing && !newContact) && <button onClick={()=>{handleDelete(props.contact)}}>delete</button>}
            </div>
          </Sidebar>
        
    )
  }

  const Contact = (props) => {

    return (
        <div onClick={()=>{props.setExpandedContact(props.data)}} style={{fontWeight: (props.selected ? "600" : "400") }} >
          {props.data.name}
        </div>
    )
  }

  const selNewContact = (contact) => {
    setNewContact(false) 
    setExpandedContact(contact)
  }

  return (
    <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
      <Box>
        <List>
          {backendData && backendData.contacts.map((c, index)=><Contact data={c} key={index} selected={expandedContact && expandedContact.name===c.name} setExpandedContact={setExpandedContact}/>)}
          {!newContact && <button onClick={()=>{setNewContact(true)}}>add</button>}

        </List>
        {(expandedContact || newContact) && <Details contact={expandedContact} newContact={newContact} selNewContact={selNewContact}/>}
        
      </Box>
    </div>
  )
}

export default App

const Box = styled.div`
  display: flex;
  justify-content: space-between;
  outline: 1px solid black;
  width: 400px;
  margin: 20px;
  &>*{
    margin: 10px;
  }
`

const Sidebar = styled.div`
  border-width: 0 0 0 1px;
  border-color: black;
  border-style: solid;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: start;
  &>*{
    margin: 0 10px 0 10px;
  }
  width: 200px;
`
const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  &>*:hover{
    cursor: pointer;
  }
`

const Field = styled.input`
  width: 100%;
`