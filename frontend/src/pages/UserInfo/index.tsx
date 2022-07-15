import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Header, Loader, Table } from 'semantic-ui-react';
import axios from '../../controllers';
import { fetchUser } from '../../controllers/users';
import { useStateValue } from '../../state';
import { clearMessage, displayMessage } from '../../state/actions/message';
import { MessageVariation } from '../../types/types';

interface IUserInfo {
    id: string,
    username: string,
    name?: string,
    roles: [{ name: string, id: string }]
}

const UserInfo = () => {
    const { id: userId } = useParams<{ id: string }>();
    const [, dispatch] = useStateValue();
    const [user, setUser] = useState<IUserInfo | undefined>(undefined);
    const [fetching, setFetching] = useState<boolean>(false);
    
    useEffect(() => {
        /*if(userId === auth?.id) {
            setUser(auth);
            return;
        }*/
        setFetching(true);
        if(userId) {
            fetchUser(userId)
                .then(data => {
                    setUser(data);
                })
                .catch(error => {
                    console.log(error);
                    setUser(undefined);
                    if(axios.isAxiosError(error)) {
                        dispatch(displayMessage({
                            text: { content: error.response?.data.error as string, header: 'Operation Failed' },
                            type: MessageVariation.error
                        }));
                        setTimeout(() => { dispatch(clearMessage()); }, 3000);
                    }
                })
                .finally(() => {
                    setFetching(false);
                });
        }
    }, [userId]);

    if(!userId) return null;

    return (
        <React.Fragment>
            <Header as="h3">User Info</Header>
            {
                fetching
                ? <Loader active content={`Fetching info for user id ${userId}`} />
                : user  
                    ? <Table compact celled collapsing className="no-border no-padding-left">
                        <Table.Body>
                        <Table.Row>
                            <Table.Cell><strong>Username</strong></Table.Cell>
                            <Table.Cell>{user.username}</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell><strong>Name</strong></Table.Cell>
                            <Table.Cell>{user?.name}</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell><strong>ID</strong></Table.Cell>
                            <Table.Cell>{user.id}</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell><strong>Roles</strong></Table.Cell>
                            <Table.Cell>{user?.roles?.map(r => r.name).join(', ')}</Table.Cell>
                        </Table.Row>
                        </Table.Body>
                      </Table>
                    : <Header as="h2">No info</Header>
            }
            
        </React.Fragment>
    );
};

export default UserInfo;
