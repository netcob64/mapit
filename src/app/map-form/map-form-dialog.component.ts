import { Component, Inject, OnInit, Input, ViewChild, OnChanges, SimpleChanges, AfterViewChecked, AfterViewInit, ElementRef } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";

@Component({
    selector: 'map-form-dialog',
    templateUrl: './map-form-dialog.component.html',
    styleUrls: ['./map-form-dialog.component.css']
})

export class MapFormDialogComponent implements OnInit {

    form: FormGroup;
    description:string;

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<MapFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) data) {

        this.description = data.description;
    }

    ngOnInit() {        
        this.form = this.fb.group({
            description: [this.description, []]}
        );
    }

    save() {
        this.dialogRef.close(this.form.value);
    }

    close() {
        this.dialogRef.close();
    }
}