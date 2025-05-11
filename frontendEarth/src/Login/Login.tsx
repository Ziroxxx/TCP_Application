import { useEffect, useState } from "react";
import { Button, TextField, Box } from "@mui/material";
import AccountCircle from '@mui/icons-material/AccountCircle';
import {useUser} from "../hooks/useUser";
import { hostname, port } from "../consts";

type LoginProps = {
    ws: WebSocket | undefined;
    setWs: (ws: WebSocket | undefined) => void;
    createWebSocket: (url: string) => WebSocket | undefined
}

export const Login: React.FC<LoginProps> = ({ws, setWs, createWebSocket}) => {
    const [svgHeight, setSvgHeight] = useState(0);
    const {login, setUser} = useUser();
    const [userName, setUsername] = useState(login);
    const [validError, setValidError] = useState("");
    const [isError, setError] = useState(false);

    const handleChangeLogin = (event: any) => {
        setError(false);
        setValidError("");
        setUsername(event.target.value);
      };

    // при авторизации регистрируем новое вебсокет соединеие
    const handleClickSignInBtn = () => {
        if(userName.length <= 20 && userName.length > 0){
            setUser({
                userInfo: {
                    Data: {
                    login: userName,
                    },
                },
                });
                if (ws) {
                ws.close(1000, 'User enter userName');
                } else {
                console.log('ws.close(1000, User enter userName); dont work');
                }
                setWs(
                createWebSocket(
                    `ws://${hostname}:${port}/?username=${encodeURIComponent(userName)}`,
                ),
                );
        }
        else if(userName.length == 0){
            setError(true);
            setValidError("Обязательное поле!");
        }
        else{
            setError(true);
            setValidError("Имя пользователя не должно превышать 20 символов!");
        }
    };
    
    useEffect(() => {
        const updateSvgHeight = () => {
        const svgElement = document.getElementById("svg") as HTMLElement;
        if (svgElement) {
            setSvgHeight(svgElement.getBoundingClientRect().height);
        }
        };

        updateSvgHeight();
        window.addEventListener("resize", updateSvgHeight);

        return () => {
        window.removeEventListener("resize", updateSvgHeight);
        };
    }, []);


    return (
      <>
        <div className="login">
            <div className="login--back">
                <svg id="svg" viewBox="0 0 1000 365" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 313C0 313 104 383 195 360C286 337 290 265 398 253C506 241 605 289 659 265C713 241 709 167 784 187C859 207 1000 150 1000 150V0H0V313Z" fill="#8951FF"/>
                </svg>

                <svg viewBox="0 0 1000 314" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 262C0 262 104 332 195 309C286 286 290 214 398 202C506 190 605 238 659 214C713 190 709 116 784 136C859 156 1000 99 1000 99V-51H0V262Z" fill="#7235F3"/>
                </svg>

                <svg viewBox="0 0 1000 255" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 203C0 203 104 273 195 250C286 227 290 155 398 143C506 131 605 179 659 155C713 131 709 57 784 77C859 97 1000 40 1000 40V-110H0V203Z" fill="#5F23DD"/>
                </svg>

                <img className="img1" src="./earth.svg" alt="Earth" style={{ top: svgHeight ? `${svgHeight * 0.67}px` : "0px" }}/>
                <img className="img2" src="./mars.svg" alt="Mars" style={{ top: svgHeight ? `${svgHeight * 0.25}px` : "0px" }}/>
            </div>

            <div className="login--topic">
                <h1 className="login--topic--text">Star Message</h1>
            </div>

            <div className="login--card">
                <Box sx={{ display: 'flex', alignItems: 'flex-end', width: "100%"}}>
                    <AccountCircle sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                    <TextField id="input-with-sx" label="Кто ты?" variant="standard" sx={{
                          '& .MuiInput-underline:hover:before': {
                            borderBottomColor: '#8951FF',
                          },
                          '& .MuiInput-underline:after': {
                            borderBottomColor: '#8951FF',
                          },
                          '& .MuiInputLabel-root.Mui-focused':{
                            color: "black"
                          },
                          width: "100%"
                    }}
                    helperText={validError}
                    onChange={handleChangeLogin}
                    error={isError}
                    />
                </Box>
                <Button variant="outlined" sx={{backgroundColor: 'white',
                    color: "#8951FF", 
                    borderColor: "#8951FF",
                    '&:hover': {
                        backgroundColor: "#8951FF",
                        color: 'white'
                    },
                    '&:active': {
                        backgroundColor: '#9C3E1D',
                    },
                }}
                onClick={handleClickSignInBtn}
                > 
                Войти
                </Button>
    
            </div>
        </div>
      </>
    );
  }