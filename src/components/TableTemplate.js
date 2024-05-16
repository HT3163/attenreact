import React, { useState } from 'react'
import { StyledTableCell, StyledTableRow } from './styles';
import { Table, TableBody, TableContainer, TableHead, TablePagination, Button } from '@mui/material';
import { Radio, RadioGroup, FormControl, FormControlLabel } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { updateStudentFields } from '../redux/studentRelated/studentHandle';
import Popup from './Popup';


const TableTemplate = ({ buttonHaver: ButtonHaver, columns, rows }) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [selectedValue, setSelectedValue] = useState(''); // State to keep track of selected value

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    const handleChange = (event) => {
        setSelectedValue(event.target.value); // Update state with selected value
    };


    const dispatch = useDispatch();
    const { currentUser } = useSelector((state) => state.user);
    const classID = currentUser.teachSclass?._id
    const subjectID = currentUser.teachSubject?._id

    // Create a new Date object for today
    const getCurrentDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    const date = getCurrentDate()
    

    const obj = {}

    const handleStatusChange = (studentId, newStatus) => {
        obj[studentId?.id] = newStatus
    };

    const uploadAttendance = () => {

        try{
            for (const key in obj) {
                console.log(`Key: ${key}, Value: ${obj[key]}`);
                const fields = { subName: subjectID, status: obj[key], date }
                dispatch(updateStudentFields(key, fields, "StudentAttendance"))
                console.log("Done")
            }
            setMessage("Done Successfully")
            setShowPopup(true)
        }catch(e){
            setMessage("Something Wrong")
            setShowPopup(true)
        }
    }


    return (
        <>
            <TableContainer>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <StyledTableRow>
                            {columns.map((column) => (
                                <StyledTableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{ minWidth: column.minWidth }}
                                >
                                    {column.label}
                                </StyledTableCell>
                            ))}

                            {
                                currentUser?.role === "Teacher" ? <>
                                    <StyledTableCell align="center">
                                        Attendance
                                    </StyledTableCell>
                                </> : ""
                            }


                            {
                                currentUser?.role === "Admin" ? <>
                                    <StyledTableCell align="center">
                                        Actions
                                    </StyledTableCell>
                                </> : ""
                            }




                        </StyledTableRow>
                    </TableHead>
                    <TableBody>
                        {rows
                            // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row) => {
                                return (
                                    <StyledTableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                        {columns.map((column) => {
                                            const value = row[column.id];

                                            return (
                                                <StyledTableCell key={column.id} align={column.align}>
                                                    {
                                                        column.format && typeof value === 'number'
                                                            ? column.format(value)
                                                            : value
                                                    }
                                                </StyledTableCell>
                                            );
                                        })}
                                        {/* {console.log(row)} */}

                                        {
                                            currentUser?.role === 'Teacher' ? <>
                                                <StyledTableCell align="center">
                                                    <RadioGroup>
                                                        <div align="center" key={row?.id}>
                                                            <FormControlLabel
                                                                control={
                                                                    <Radio
                                                                        onChange={() => handleStatusChange(row, 'Present')}
                                                                        value="Present"
                                                                    />
                                                                }
                                                                label={`Present`}
                                                            />
                                                            <FormControlLabel
                                                                control={
                                                                    <Radio
                                                                        onChange={() => handleStatusChange(row, 'Absent')}
                                                                        value="Absent"
                                                                    />
                                                                }
                                                                label={`Absent`}
                                                            />
                                                        </div>
                                                    </RadioGroup>


                                                </StyledTableCell>
                                            </> : ""
                                        }
                                        {
                                            currentUser?.role === 'Admin' ? <>
                                                <StyledTableCell align="center">
                                                    <ButtonHaver row={row} />
                                                </StyledTableCell>
                                            </> : ""
                                        }






                                    </StyledTableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </TableContainer>


            {
                currentUser?.role === "Teacher" ? <>
                    <div style={{ display: 'flex', justifyContent: 'center',margin:"10px"}}>
                        <Button onClick={()=> uploadAttendance()} variant="contained" color="primary">
                            Submit Attendance
                        </Button>
                        <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />

                    </div>
                </> : ""
            }



            {/* <TablePagination
                rowsPerPageOptions={[5, 10, 25, 100]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(event, newPage) => setPage(newPage)}
                onRowsPerPageChange={(event) => {
                    setRowsPerPage(parseInt(event.target.value));
                    setPage(0);
                }}
            /> */}
        </>
    )
}

export default TableTemplate