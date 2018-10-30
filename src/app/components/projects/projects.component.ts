import { AngularFirestore } from 'angularfire2/firestore';
import { Component, OnInit } from '@angular/core';
import { Project } from '../../models/project.model';
import { ProjectService } from '../../services/project.service';
import { slugify } from '../../functions/slugify';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { FormGroup } from '@angular/forms';
import { FormlyJsonschema } from '@ngx-formly/core/json-schema';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  project$;
  project: Project = null;
  form = new FormGroup({});
  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[] = [
    this.formlyJsonschema.toFieldConfig({
      type: 'object',
      required: ['name'],
      properties: {
        name: {
          key: 'Input',
          type: 'input',
          templateOptions: {
            label: 'Project Name',
            placeholder: 'Project Name',
            required: true
          }
        },
        description: {
          key: 'Input',
          type: 'input',
          templateOptions: {
            label: 'Project Description',
            placeholder: 'Project Description',
            required: true
          }
        },
        path: {
          key: 'Input',
          type: 'input',
          templateOptions: {
            label: '',
            disabled: true,
            placeholder: 'path',
            required: true
          }
        },
        models: {
          type: 'array',
          title: 'Models',
          fieldGroupClassName: 'model-array',
          items: {
            type: 'object',
            required: ['name'],
            properties: {
              name: {
                type: 'string',
                title: 'Model Name',
                description: 'Model Description'
              },
              fields: {
                type: 'array',
                title: 'Fields',
                fieldGroupClassName: 'model-fields-array',
                items: {
                  type: 'object',
                  required: ['name', 'type', 'default'],
                  properties: {
                    name: {
                      type: 'string',
                      title: 'Title'
                    },
                    type: {
                      type: 'string',
                      title: 'Type'
                    },
                    default: {
                      type: 'string',
                      title: 'Default'
                    }
                  }
                }
              }
            }
          }
        }
      }
    })
  ];

  constructor(
    private projectService: ProjectService,
    private formlyJsonschema: FormlyJsonschema
  ) {
    this.project$ = projectService.get();
  }

  submit() {
    alert(JSON.stringify(this.project));
  }
  ngOnInit() {}
  addProject() {
    this.project = {
      id: null,
      name: '',
      path: '',
      description: '',
      models: {}
    };
  }
  editProject(selected: Project) {
    this.project = selected;
  }
  deleteProject() {
    this.projectService.delete(this.project);
    this.project = null;
  }
  saveProject() {
    this.project.path = slugify(this.project.name.toLowerCase()).replace(
      /-/g,
      '_'
    );
    this.projectService.save(this.project);
  }
}
