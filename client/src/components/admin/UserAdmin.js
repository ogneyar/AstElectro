
import React, { useContext, useState, useEffect } from 'react'

import { Modal, Button } from 'react-bootstrap'
import { observer } from 'mobx-react-lite'

import { getUsers } from '../../http/userAPI'

import { Context } from '../..'


const UserAdmin = (props) => {

    const { userStore } = useContext(Context)

    const [ users, setUsers ] = useState(null)

    useEffect(() => {
        if (userStore.user) {
            // alert(userStore.user.length)
            // console.log(userStore.user.name)
            
            getUsers()
                .then(
                    data => {
                        // console.log(data)
                        setUsers(data)
                    },
                    error => console.log(error)
                )
                .catch(error => console.log(error))

        }
    }, [userStore])

    return (
        <Modal
            show={props?.show}
            // onHide={props?.onHide}
            onHide={() => null}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header 
                // closeButton
            >
                <Modal.Title id="contained-modal-title-vcenter">
                    Редактор пользователей
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            
            <div className='d-flex flex-column'>
                В разработке... <br /><br />
                {users && users[0] != undefined &&
                users.map(item => {
                    // console.log(item)
                    return (
                    <div key={item.id+"oop"}>
                        {item.name}
                        <br />
                    </div>
                    )
                })
                }
                <Button
                    variant="outline-success"
                >
                    Добавить пользователя
                </Button>
            </div>

            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-danger" onClick={props?.onHide}>Закрыть</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default observer(UserAdmin)
