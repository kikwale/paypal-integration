import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { PayPalButton } from 'react-paypal-button-v2';

export default function Dashboard({ auth }) {
    const [tasks, setTasks] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskPrice, setNewTaskPrice] = useState('');

    // useEffect to fetch tasks on component mount
    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = () => {
        fetch('/api/task')
            .then((response) => response.json())
            .then((data) => {
                console.log('API Response:', data);

                // Assuming data is an array, set it to tasks state
                setTasks(data.task);
            })
            .catch((error) => console.error('Error fetching tasks:', error));
    };

    // Function to open the modal
    const openModal = () => {
        setIsModalOpen(true);
    };

    // Function to close the modal
    const closeModal = () => {
        setIsModalOpen(false);
    };

      // Function to handle the form submission for creating a new task
      const handleTaskCreation = async (event) => {
        event.preventDefault();

        // Add your logic for creating a new task here
        console.log('Creating a new task:', newTaskTitle, newTaskPrice);

        // Submit data to the backend API
        try {
            const response = await fetch('http://localhost:8000/api/task', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Add any other headers if needed (e.g., authentication token)
                },
                body: JSON.stringify({
                    title: newTaskTitle,
                    price: newTaskPrice,
                    // Add other properties as needed
                }),
            });

            if (!response.ok) {
                throw new Error('Error creating task');
            }

            // Assuming the API responds with the created task data
            const responseData = await response.json();
            console.log('Task created successfully:', responseData);

            // Reset the form fields
            setNewTaskTitle('');
            setNewTaskPrice('');

            // Close the modal after task creation
            closeModal();

            // Fetch updated tasks after creating a new task
            fetchTasks();
        } catch (error) {
            console.error('Error creating task:', error);
            // Handle error, show user a message, etc.
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2"
                                onClick={openModal}
                            >
                                Add Task
                            </button>

                            {/* Display tasks in cards with three columns */}
                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {tasks.map((task) => (
                                    <div key={task.id} className="bg-gray-100 p-4 rounded-md">
                                        <p className="font-semibold">{task.title}</p>
                                        <p className="text-gray-600">Price: ${task.price}</p>
                                        <p className="text-gray-600">Description: {task.description}</p>
                                        <p className="text-gray-600">Created At: {task.id}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Modal for creating a new task */}
                           {/* Modal for creating a new task */}
                            {isModalOpen && (
                                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
                                    <div className="bg-white p-6 rounded-md">
                                        <h2 className="text-lg font-semibold mb-4">Create a New Task</h2>
                                        <form onSubmit={handleTaskCreation}>
                                            <div className="mb-8">
                                                <label className="block text-sm font-medium text-gray-600">
                                                    Task Title
                                                </label>
                                                <input
                                                    type="text"
                                                    value={newTaskTitle}
                                                    onChange={(e) => setNewTaskTitle(e.target.value)}
                                                    className="mt-1 p-2 w-full border rounded-md"
                                                />
                                            </div>
                                            <div className="mb-8">
                                                <label className="block text-sm font-medium text-gray-600">
                                                    Price
                                                </label>
                                                <input
                                                    type="text"
                                                    value={newTaskPrice}
                                                    onChange={(e) => setNewTaskPrice(e.target.value)}
                                                    className="mt-1 p-2 w-full border rounded-md"
                                                />
                                            </div>

                                            <div className="mb-8">
                                            {/* PayPal button */}
                                            <PayPalButton
                                                amount={newTaskPrice}
                                                onSuccess={(details, data) => {
                                                    // Handle successful payment
                                                    console.log('Payment successful', details, data);
                                                    // You might want to trigger task creation after payment success
                                                    handleTaskCreation();
                                                    // Close the modal after payment success
                                                    closeModal();
                                                }}
                                                options={{
                                                    clientId: 'AXykhON6kNnh6bNtwbCEt8pslvKU9tyTbUc4pCV_Fo46OPG2nr4B5zvyUZn7wlH121IXcVGoFhJi6f1d',
                                                    currency: 'USD',
                                                }}
                                            />
                                         </div>

                                            <div className="flex justify-end">
                                                <button
                                                    type="button"
                                                    onClick={closeModal}
                                                    className="mr-2 bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="bg-green-500 text-white px-4 py-2 rounded-md"
                                                >
                                                    Create Task
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )} 
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}