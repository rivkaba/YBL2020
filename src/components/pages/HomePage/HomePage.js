import React from "react";
import Grid from "@material-ui/core/Grid";
import {Button} from "@material-ui/core";
import {Link} from "react-router-dom";
import '../Users/UserPage.css'
import {auth} from "../../../firebase/firebase";



class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };


    }
    async componentDidMount() {
        await auth.onAuthStateChanged(user => {
            if(user) {
                this.setState({user:user})
                // this.props.history.push({
                //     pathname: '/User',
                //     data: user // your data array of objects
                // })
            }
        })
    }

    render() {
        return (
            <div id="instructor" className="sec-design" dir='rtl'>
                <div id="instructor_menu" className="form-design" name="student_form">
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <div>

                                <Button
                                    type="submit"
                                    style={{style: {margin: '10px'}}}
                                    fullWidth
                                    variant="contained"
                                    id="LoginBtn"
                                    onClick={()=>{
                                        if(this.state.user)
                                        {
                                            this.props.history.push({
                                                pathname: '/User',
                                                data: this.state.user // your data array of objects
                                            })
                                        }
                                        else{
                                            this.props.history.push({
                                                pathname: '/Login',
                                            })
                                        }
                                    }}>
                                    ?????????? ??????????????
                                </Button>
                            </div>
                        </Grid>
                        <Grid item xs={12}>
                            <div>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    id="registerBtn"
                                    component={Link}
                                    to="/SignUp">
                                    ??????????
                                </Button>
                            </div>
                        </Grid>
                    </Grid>
                </div>

            </div>
        )
    }
}

export  default  HomePage;