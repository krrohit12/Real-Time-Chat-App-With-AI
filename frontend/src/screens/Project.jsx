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
    const messageBox = React.createRef()
    const { user } = useContext(UserContext)
    const [users, setusers] = useState([]);

    function addcollab() {
        axios.put('/projects/add-user', {
            projectId: location.state.project._id,
            users: Array.from(selectedUserId)
        }).then(res => {
            setproject(res.data.project);
            setSelectedUserId([]);
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
            } else {
                newselectedid.add(id);
            }
            return newselectedid;
        })
    };

    const send = () => {
        sendMessage('project-message', { message, sender: user })
        setMessages(prevMessages => [...prevMessages, { sender: user, message }])
        setmessage("")
    }

    function WriteAiMessage(message) {
        const messageObject = JSON.parse(message)
        return (
            <div className='overflow-auto bg-gray-900 text-green-300 rounded-lg p-3 text-xs'>
                <Markdown children={messageObject.text} />
            </div>
        )
    }

    useEffect(() => {
        initializeSocket(project._id)
        receiveMessage('project-message', data => {
            if (data.sender._id == 'ai') {
                const message = JSON.parse(data.message)
                if (message.fileTree) {
                    setFileTree(message.fileTree || {})
                }
                setMessages(prevMessages => [...prevMessages, data])
            } else {
                setMessages(prevMessages => [...prevMessages, data])
            }
        })

        axios.get(`/projects/get-project/${location.state.project._id}`).then(res => {
            setproject(res.data.project)
            setMessages(res.data.project.messages || [])
            setFileTree(res.data.project.fileTree || {})
        }).catch(err => {
            console.log(err)
        })

        axios.get('/users/all').then(res => {
            setusers(res.data.users);
        }).catch(err => {
            console.log(err)
        })
    }, [])

    useEffect(() => {
        if (messageBox.current) {
            messageBox.current.scrollTop = messageBox.current.scrollHeight;
        }
    }, [messages]);

    return (
        <main className='h-screen w-screen flex bg-gray-950 text-white'>

            {/* Left: Chat Panel */}
            <section className="left relative flex flex-col h-screen w-96 min-w-96 bg-gray-900 border-r border-gray-800">

                {/* Chat Header */}
                <header className={`flex justify-between items-center px-4 py-3 bg-gray-900 border-b border-gray-800 absolute z-10 top-0 w-full ${isSideOpen ? 'hidden' : 'flex'}`}>
                    <div className='flex items-center gap-2'>
                        <div className='w-7 h-7 bg-blue-600 rounded-md flex items-center justify-center'>
                            <i className="ri-code-box-line text-sm"></i>
                        </div>
                        <span className='font-semibold capitalize'>{project.name}</span>
                    </div>
                    <div className='flex items-center gap-2'>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className='flex items-center gap-1 text-xs px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-md transition'
                        >
                            <i className="ri-user-add-line"></i>
                            Add
                        </button>
                        <button
                            onClick={() => setisSideOpen(true)}
                            className='p-1.5 hover:bg-gray-800 rounded-md transition'
                            title="Collaborators"
                        >
                            <i className="ri-group-fill text-gray-400"></i>
                        </button>
                    </div>
                </header>

                {/* Messages */}
                <div className="conversation pt-14 pb-14 flex-grow flex flex-col h-full relative">
                    <div
                        ref={messageBox}
                        className="msg-box p-3 flex-grow flex flex-col gap-2 overflow-auto max-h-full"
                    >
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex flex-col gap-1 w-fit max-w-[80%] ${msg.sender._id == user._id?.toString() ? 'ml-auto items-end' : 'items-start'}`}
                                onClick={() => {
                                    if (msg.sender._id === 'ai') {
                                        try {
                                            const parsed = JSON.parse(msg.message)
                                            if (parsed.fileTree) {
                                                setFileTree(parsed.fileTree)
                                                setCurrentFile(null)
                                                setOpenFiles([])
                                            }
                                        } catch (e) {}
                                    }
                                }}
                                style={msg.sender._id === 'ai' ? { cursor: 'pointer' } : {}}
                            >
                                <small className='text-xs text-gray-500 px-1'>{msg.sender.email}</small>
                                <div className={`rounded-xl px-3 py-2 text-sm ${
                                    msg.sender._id === 'ai'
                                        ? 'bg-gray-800 w-72'
                                        : msg.sender._id == user._id?.toString()
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-800 text-gray-100'
                                }`}>
                                    {msg.sender._id === 'ai'
                                        ? WriteAiMessage(msg.message)
                                        : <p>{msg.message}</p>
                                    }
                                </div>
                                {msg.sender._id === 'ai' && (
                                    <small className='text-xs text-gray-600 px-1'>Click to load files</small>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Input */}
                    <div className="send w-full flex absolute bottom-0 border-t border-gray-800 bg-gray-900">
                        <input
                            onChange={(e) => setmessage(e.target.value)}
                            value={message}
                            onKeyDown={(e) => e.key === 'Enter' && send()}
                            type="text"
                            placeholder="Message or @ai ..."
                            className="p-3 px-4 bg-transparent outline-none flex-grow text-sm text-white placeholder-gray-500"
                        />
                        <button
                            onClick={send}
                            className="w-12 flex items-center justify-center text-blue-400 hover:text-blue-300 transition"
                        >
                            <i className="ri-send-plane-fill text-lg"></i>
                        </button>
                    </div>
                </div>

                {/* Collaborators Side Panel */}
                <div className={`side-panel flex flex-col absolute top-0 left-0 w-full h-full bg-gray-900 border-r border-gray-800 transition-transform duration-300 z-20 ${isSideOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <header className='flex justify-between items-center px-4 py-3 border-b border-gray-800'>
                        <h1 className='font-semibold'>Collaborators</h1>
                        <button onClick={() => setisSideOpen(false)} className='p-1.5 hover:bg-gray-800 rounded-md transition'>
                            <i className="ri-close-fill text-gray-400"></i>
                        </button>
                    </header>
                    <div className="flex flex-col gap-2 p-4 overflow-auto">
                        {project.users && project.users.map((u) => (
                            <div key={u._id} className="flex gap-3 items-center p-2 rounded-lg hover:bg-gray-800 transition">
                                <div className="w-9 h-9 bg-blue-600/20 rounded-full flex items-center justify-center">
                                    <i className="ri-user-3-line text-blue-400"></i>
                                </div>
                                <span className='text-sm text-gray-200'>{u.email}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Add Collaborator Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
                        <div className="bg-gray-900 border border-gray-700 p-6 rounded-xl shadow-2xl w-96 flex flex-col max-h-[80vh]">
                            <div className='flex justify-between items-center mb-4'>
                                <h2 className="text-lg font-semibold">Add Collaborator</h2>
                                <button onClick={() => setIsModalOpen(false)} className='text-gray-400 hover:text-white transition'>
                                    <i className="ri-close-line text-xl"></i>
                                </button>
                            </div>
                            <ul className="space-y-2 overflow-y-auto flex-grow border border-gray-700 rounded-lg p-2">
                                {users.map((u) => (
                                    <li
                                        key={u._id}
                                        onClick={() => handleUserClick(u._id)}
                                        className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition ${Array.from(selectedUserId).includes(u._id) ? 'bg-blue-600/30 border border-blue-500' : 'hover:bg-gray-800'}`}
                                    >
                                        <div className='w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center'>
                                            <i className="ri-user-line text-gray-300 text-sm"></i>
                                        </div>
                                        <span className='text-sm'>{u.email}</span>
                                        {Array.from(selectedUserId).includes(u._id) && (
                                            <i className="ri-check-line text-blue-400 ml-auto"></i>
                                        )}
                                    </li>
                                ))}
                            </ul>
                            <button
                                onClick={addcollab}
                                className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                            >
                                Add Collaborator
                            </button>
                        </div>
                    </div>
                )}
            </section>

            {/* Right: Code Editor */}
            <section className="right flex-grow h-full flex bg-gray-950">

                {/* File Explorer */}
                <div className="explorer h-full w-52 min-w-52 bg-gray-900 border-r border-gray-800 flex flex-col">
                    <div className='px-4 py-3 border-b border-gray-800'>
                        <p className='text-xs text-gray-500 uppercase tracking-wider font-semibold'>Explorer</p>
                    </div>
                    <div className="file-tree w-full overflow-auto flex-grow">
                        {Object.keys(fileTree).map((file, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    setCurrentFile(file)
                                    setOpenFiles([...new Set([...openFiles, file])])
                                }}
                                className={`w-full flex items-center gap-2 px-4 py-2 text-sm text-left hover:bg-gray-800 transition ${currentFile === file ? 'bg-gray-800 text-blue-400' : 'text-gray-300'}`}
                            >
                                <i className="ri-file-code-line text-gray-500 text-xs"></i>
                                {file}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Code Area */}
                <div className="code-editor flex flex-col flex-grow h-full">
                    {/* Open File Tabs */}
                    <div className="tabs flex border-b border-gray-800 bg-gray-900 overflow-x-auto">
                        {openFiles.map((file, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentFile(file)}
                                className={`flex items-center gap-2 px-4 py-2 text-sm whitespace-nowrap border-r border-gray-800 transition ${currentFile === file ? 'bg-gray-950 text-blue-400 border-t-2 border-t-blue-500' : 'text-gray-400 hover:bg-gray-800'}`}
                            >
                                <i className="ri-file-code-line text-xs"></i>
                                {file}
                            </button>
                        ))}
                    </div>

                    {/* Code Content */}
                    <div className="flex-grow overflow-auto bg-gray-950">
                        {fileTree[currentFile] ? (
                            <pre className="hljs h-full">
                                <code
                                    className="hljs h-full outline-none block"
                                    contentEditable
                                    suppressContentEditableWarning
                                    onBlur={(e) => {
                                        const updatedContent = e.target.innerText;
                                        setFileTree({ ...fileTree, [currentFile]: { file: { contents: updatedContent } } });
                                    }}
                                    dangerouslySetInnerHTML={{
                                        __html: hljs.highlight('javascript', fileTree[currentFile].file.contents).value
                                    }}
                                    style={{ whiteSpace: 'pre-wrap', paddingBottom: '25rem' }}
                                />
                            </pre>
                        ) : (
                            <div className='flex flex-col items-center justify-center h-full text-gray-600'>
                                <i className="ri-code-s-slash-line text-5xl mb-3"></i>
                                <p className='text-sm'>Select a file to view its code</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </main>
    );
}

export default Project;
