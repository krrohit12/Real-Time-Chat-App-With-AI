import React, { useEffect, useState, useContext } from 'react'
import { useLocation } from 'react-router-dom'
import axios from '../config/axios'
import { UserContext } from '../context/user.context'
import Markdown from 'markdown-to-jsx'
import { initializeSocket, receiveMessage, sendMessage } from '../config/socket'
import hljs from 'highlight.js';
const Project = () => {
    const location = useLocation();
    const [message, setmessage] = useState('')
    const [messages, setMessages] = useState([])
    const [isSideOpen, setisSideOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState([]);
    const [fileTree, setFileTree] = useState({})
    const [currentFile, setCurrentFile] = useState(null)
    const [openFiles, setOpenFiles] = useState([])
    const [project, setproject] = useState(location.state.project)
    // console.log(location.state);
    const messageBox = React.createRef()
    const { user } = useContext(UserContext)
    const [users, setusers] = useState([]);
    function addcollab() {
        axios.put('/projects/add-user', {
            projectId: location.state.project._id,
            users: Array.from(selectedUserId)
        }).then(res => {
            setIsModalOpen(false);
        }).catch(err => {
            console.log(err)
        })
    }
    const handleUserClick = (id) => {
        setSelectedUserId(prev => {
            const newselectedid = new Set(prev);
            if (newselectedid.has(id)) {
                newselectedid.delete(id);
            }
            else {
                newselectedid.add(id);
            }
            return newselectedid;
        })
    };
    const send = () => {
        console.log(user)
        sendMessage('project-message', {
            message,
            sender: user
        })
        setMessages(prevMessages => [...prevMessages, { sender: user, message }]) // Update messages state
        setmessage("")
    }
    function WriteAiMessage(message) {

        const messageObject = JSON.parse(message)

        return (
            <div
                className='overflow-auto bg-slate-950 text-white rounded-sm p-2'
            >
                <Markdown
                    children={messageObject.text}
                // options={{
                //     overrides: {
                //         code: SyntaxHighlightedCode,
                //     },
                // }}
                />
            </div>)
    }
    useEffect(() => {
        initializeSocket(project._id)
        console.log(project._id)
        receiveMessage('project-message', data => {
            if (data.sender._id == 'ai') {


                const message = JSON.parse(data.message)

                console.log(message)

                if (message.fileTree) {
                    setFileTree(message.fileTree || {})
                }
                setMessages(prevMessages => [ ...prevMessages, data ]) // Update messages state
            } else {

                setMessages(prevMessages => [ ...prevMessages, data ]) // Update messages state
            }
        })

        axios.get(`/projects/get-project/${location.state.project._id}`).then(res => {
            setproject(res.data.project)
            // console.log(res.data.users)
        }).catch(err => {
            console.log(err)
        })


        axios.get('/users/all').then(res => {
            setusers(res.data.users);
            // console.log(res.data.users)
        }).catch(err => {
            console.log(err)
        })
    }, [])
    useEffect(() => {
        if (messageBox.current) {
            messageBox.current.scrollTop = messageBox.current.scrollHeight;
        }
    }, [messages]);
    // function saveFileTree(ft) {
    //     axios.put('/projects/update-file-tree', {
    //         projectId: project._id,
    //         fileTree: ft
    //     }).then(res => {
    //         console.log("gya")
    //         console.log(res.data)
    //     }).catch(err => {
    //         console.log(err)
    //     })
    // }
    return (
        <main className='h-screen w-screen flex'>
            <section className="left relative flex flex-col h-screen min-w-96 bg-slate-300">
                <header className={`flex justify-between items-center p-2 px-4 w-full bg-slate-100 absolute z-10 top-0 transition-all duration-300 ${isSideOpen ? 'hidden' : 'block'}`}>
                    <button className='flex gap-2' onClick={() => setIsModalOpen(true)}>
                        <i className="ri-add-fill mr-1"></i>
                        <p>Add collaborator</p>
                    </button>
                    <button onClick={() => setisSideOpen(!isSideOpen)} className='p-2'>
                        <i className="ri-group-fill"></i>
                    </button>
                </header>
                <div className="conversation pt-14 pb-10 flex-grow flex flex-col h-full relative">

                    <div
                        ref={messageBox}
                        className="msg-box p-1 flex-grow flex flex-col gap-1 overflow-auto max-h-full scrollbar-hide">
                        {messages.map((msg, index) => (
                            <div key={index} className={`${msg.sender._id === 'ai' ? 'max-w-80' : 'max-w-52'} ${msg.sender._id == user._id.toString() && 'ml-auto'}  message flex flex-col p-2 bg-slate-50 w-fit rounded-md`}>
                                <small className='opacity-65 text-xs'>{msg.sender.email}</small>
                                <div className='text-sm'>
                                    {msg.sender._id === 'ai' ?
                                        WriteAiMessage(msg.message)
                                        : <p>{msg.message}</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="send w-full flex absolute bottom-0">
                        <input
                            onChange={(e) => setmessage(e.target.value)}
                            value={message}
                            type="text"
                            placeholder="Enter text here"
                            className="p-2 px-4 border-none outline-none flex-grow"
                        />
                        <button
                            onClick={send}
                            className="w-12 flex items-center justify-center bg-slate-800 text-white">
                            <i className="ri-send-plane-fill"></i>
                        </button>
                    </div>
                </div>

                {/* Side Panel */}
                <div className={`side-panel flex flex-col gap-2 absolute top-0 left-0 w-full h-full bg-slate-200 transition-transform duration-300 ${isSideOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <header className='flex justify-between items-center px-4 p-2 bg-slate-200'>

                        <h1
                            className='font-semibold text-lg'
                        >Collaborators</h1>

                        <button onClick={() => setisSideOpen(!isSideOpen)} className='p-2'>
                            <i className="ri-close-fill"></i>
                        </button>
                    </header>

                    <div className="users flex flex-col gap-2 p-4">
                        {project.users && project.users.map((user) => (
                            <div
                                key={user._id}
                                onClick={() => setIsModalOpen(true)}
                                className="user flex gap-2 items-center cursor-pointer hover:bg-slate-50 p-2 rounded-lg transition"
                            >
                                <div className="aspect-square bg-slate-500 rounded-full w-12 h-12 flex items-center justify-center text-white">
                                    <i className="ri-user-3-line"></i>
                                </div>
                                <h1 className="font-semibold text-lg">{user.email}</h1>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Modal for User Selection */}
                {isModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative max-h-[80vh] flex flex-col">
                            {/* Cancel Button */}
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-3 right-3 text-gray-500 hover:text-red-600 transition"
                            >
                                <i className="ri-close-line text-2xl"></i>
                            </button>

                            <h2 className="text-xl font-semibold mb-4 text-center">Select a User</h2>

                            {/* Scrollable User List */}
                            <ul className="space-y-2 overflow-y-auto max-h-[50vh] border p-2 rounded-lg">
                                {users.map((user) => (
                                    <li
                                        key={user._id}
                                        onClick={() => handleUserClick(user._id)}
                                        className={`p-2 border rounded-lg cursor-pointer transition ${Array.from(selectedUserId).indexOf(user._id) != -1 ? 'bg-slate-400' : ''}`}
                                    >
                                        {user.email}
                                    </li>
                                ))}
                            </ul>

                            {/* Add Collaborator Button */}
                            <button
                                onClick={addcollab}
                                className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                                disabled={!selectedUserId}
                            >
                                Add Collaborator
                            </button>
                        </div>
                    </div>
                )}

            </section>


            <section className="right  bg-red-50 flex-grow h-full flex">

                <div className="explorer h-full max-w-64 min-w-52 bg-slate-200">
                    <div className="file-tree w-full">
                        {
                            Object.keys(fileTree).map((file, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setCurrentFile(file)
                                        setOpenFiles([...new Set([...openFiles, file])])
                                    }}
                                    className="tree-element cursor-pointer p-2 px-4 flex items-center gap-2 bg-slate-300 w-full">
                                    <p
                                        className='font-semibold text-lg'
                                    >{file}</p>
                                </button>))

                        }
                    </div>

                </div>


                <div className="code-editor flex flex-col flex-grow h-full shrink">

                    <div className="top flex justify-between w-full">

                        <div className="files flex">
                            {
                                openFiles.map((file, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentFile(file)}
                                        className={`open-file cursor-pointer p-2 px-4 flex items-center w-fit gap-2 bg-slate-300 ${currentFile === file ? 'bg-slate-400' : ''}`}>
                                        <p
                                            className='font-semibold text-lg'
                                        >{file}</p>
                                    </button>
                                ))
                            }
                        </div>
                    </div>
                    <div className="bottom flex flex-grow max-w-full shrink overflow-auto">
                    {fileTree[ currentFile ] && (
                                <div className="code-editor-area h-full overflow-auto flex-grow bg-slate-50">
                                    <pre
                                        className="hljs h-full">
                                        <code
                                            className="hljs h-full outline-none"
                                            contentEditable
                                            suppressContentEditableWarning
                                            onBlur={(e) => {
                                                const updatedContent = e.target.innerText;
                                                const ft = { ...fileTree, [currentFile]: { file: { contents: updatedContent } } };
                                                setFileTree(ft);
                                                

                                            }}
                                        dangerouslySetInnerHTML={{
                                            __html: hljs.highlight('javascript', fileTree[currentFile].file.contents).value
                                        }}
                                        
                                            style={{
                                                whiteSpace: 'pre-wrap',
                                                paddingBottom: '25rem',
                                                counterSet: 'line-numbering',
                                            }}
                                        />
                                    </pre>
                                </div>
                            )
                        }
                    </div>

                </div>


            </section>
        </main>
    );
}

export default Project;
