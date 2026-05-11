import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


// type AppContextType = {
//     user: boolean | null;
//     setUser: React.Dispatch<React.SetStateAction<string | null>>;
//     showLogin: boolean | null;
//     setShowLogin: React.Dispatch<React.SetStateAction<string | null>>;
//     username: string | null;
//     setUsername: React.Dispatch<React.SetStateAction<string | null>>;
// };

// create context
export const AppContext = createContext<any>({
    user: null,
    setUser: () => { },
    showLogin: false,
    setShowLogin: () => { },
    username: "",
    setUsername: () => { },
    credit: 0,
    setCredit: () => { }
});


// create provider
const AppContextProvider = ({ children }: any) => {
    const [user, setUser] = useState<any>(null);
    const [username, setUsername] = useState<any>('');
    const [showLogin, setShowLogin] = useState(false);
    const [credit, setCredit] = useState(0);

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const navigate = useNavigate();

    const loadCreditData = async () => {
        try {
            const data = await fetch(backendUrl + '/api/user/credit', {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${localStorage.getItem('token')}`
                }
            }).then(data => data.json()).catch(err => toast.error(err));

            if (data.success) {

                setCredit(data.credits);
            }
        } catch (error: any) {
            toast.error(error);
        }
    }


    // generate image:

    const generateImage = async (input: any) => {
        // call to api
        const responseImage = await fetch(backendUrl + '/api/image/generate', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                prompt: input,

            })
        }).then(data => data.json())
            .catch(err => toast.error(err));

        if (responseImage.success) {
            loadCreditData();
            return responseImage.image;
        } else {
            toast.error(responseImage.msg)
            // check if credit is 0 redirect to buy credit page
            loadCreditData();
            if (credit === 0) {
                navigate('/buy')
            }
        }

    }



    // check in localstorage
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            loadCreditData();
            setUser(true);
            setUsername(localStorage.getItem('username') || "");
        }
    }, []);




    return (
        <AppContext.Provider value={{
            user, setUser,
            showLogin, setShowLogin,
            username, setUsername,
            credit, setCredit,
            backendUrl, loadCreditData,
            generateImage
        }}>
            {children}

        </AppContext.Provider>
    )

}

export default AppContextProvider;

