import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from "@angular/forms";
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

import { BranchService } from "../../../services/branchService";

import { AppConstants } from "../../../constants/AppConstants";
import { BranchDto } from '../../../services/branchDto';

@Component({
  selector: 'app-branch',
  templateUrl: './branch.component.html',
  styleUrls: ['./branch.component.scss']
})
export class BranchComponent implements OnInit {

  tableGrid: Boolean = true;

  tableGridData: BranchDto[];

  branchList: any[]=[];

  title: String = "Branch Master";

  form: Boolean = false;

  readOnly: Boolean = false;

  formDeatils: FormGroup;

  branchSearchForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient, private branchService: BranchService) {

    this.getAllBranch();

  }

  ngOnInit(): void {

    this.branchSearchForm = this.fb.group({

      branchCode: [null],
      branchName: [null],
      parentBranchCode:[null],
      status: [null],

    });

    this.formDeatils = this.fb.group({

      branchCode: ['', Validators.required],
      branchName: ['', Validators.required],
      parentBranchCode: ['', Validators.required],
      status: [''],
      action: [AppConstants.NEW, Validators.required]

    })


  }


  showForm() {

    this.readOnly = false;

    this.formDeatils.reset();

    this.formDeatils.patchValue({ action: AppConstants.NEW });

    this.title = "Add / Edit Branch";

    this.form = true;
    this.tableGrid = false;

  }

  showGrid() {

    this.title = "Branch Master";

    this.form = false;
    this.tableGrid = true;

  }

  getAllBranch() {

    // this.branchService.getAllBranch().subscribe((data) => {

    //   this.tableGridData = data['responseDto'];

    // })

    this.branchService.getAllBranch().subscribe((data: any) => {
      this.tableGridData = data.responseDto;
      this.branchList=data.responseDto;
    })

  }

  get validate_form() { return this.formDeatils.controls; }

  save() {

    console.log(this.formDeatils.value);

    if (this.formDeatils.valid) {



      this.http.post(AppConstants.SAVE_BRANCH, this.formDeatils.value).subscribe((data) => {

        if (data['status'] == AppConstants.SUCCESS) {

          Swal.fire({
            icon: 'success',
            title: '',
            text: data['msg'],
          }).then((result) => {
            if (result.isConfirmed) {

              this.getAllBranch();
              this.showGrid();

            } else if (result.isDenied) {

            }
          })

        } else {

          Swal.fire({
            icon: 'error',
            title: '',
            text: data['exceptionMsg'],
          })

        }

        console.log("res" + JSON.stringify(data))
      });
    }


  }


  editBranch(input) {

    
    this.showForm();
    
    this.readOnly = true;

    this.formDeatils.patchValue(
      {
        branchCode: input.branchCode,
        branchName: input.branchName,
        parentBranchCode: input.branchCode,
        action: AppConstants.EDIT,
        status: input.status,
      }
    );

  }
  searchBranch() {

    this.branchService.searchBranch(this.branchSearchForm.value).subscribe((data: any) => {

      this.tableGridData = data.responseDto;

    })

  }

  searchBranchReset() {

    this.branchSearchForm.reset();

    this.getAllBranch();

  }

}
