import React, { PureComponent } from "react";
import styles from "./Search.css";

class Search extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
        this.searchRef = React.createRef();
    }

    render() {
        const { placeholder, searchHandler, marginRight = 0 } = this.props;
        return <>
            <div className={styles.block}>
                <div className={styles.searchbar} style={{width: `calc(100% - ${marginRight}px)`}}>
                    <div className={styles.searchbar__inputContainer}>
                        <input
                            type="text"
                            className={styles.searchbar__input} 
                            onChange={() => {searchHandler(this.searchRef.current.value)}}
                            ref={this.searchRef}
                            placeholder={placeholder}
                        />
                    </div>
                </div>
            </div>
        </>
    }
}

export default Search

