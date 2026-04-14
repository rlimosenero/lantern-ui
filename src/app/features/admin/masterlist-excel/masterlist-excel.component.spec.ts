import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MasterlistExcelComponent } from './masterlist-excel.component';
import { AdminService } from '../services/admin.service';
import { of, throwError } from 'rxjs';

describe('MasterlistExcelComponent', () => {
  let component: MasterlistExcelComponent;
  let fixture: ComponentFixture<MasterlistExcelComponent>;
  let adminServiceSpy: jasmine.SpyObj<AdminService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('AdminService', ['getMasterExcel', 'importExcel']);

    await TestBed.configureTestingModule({
      imports: [MasterlistExcelComponent],
      providers: [
        { provide: AdminService, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MasterlistExcelComponent);
    component = fixture.componentInstance;
    adminServiceSpy = TestBed.inject(AdminService) as jasmine.SpyObj<AdminService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('downloadMasterExcel', () => {
    it('should download the file and change state on success', fakeAsync(() => {
      const mockBlob = new Blob(['test content'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      adminServiceSpy.getMasterExcel.and.returnValue(of(mockBlob));

      // Mock URL methods to prevent actual browser navigation/errors
      const createSpy = spyOn(window.URL, 'createObjectURL').and.returnValue('blob:url');
      const revokeSpy = spyOn(window.URL, 'revokeObjectURL');
      
      component.downloadMasterExcel();

      expect(component.isLoading).toBeTrue();
      
      // Simulate observable completion
      tick();

      expect(component.isLoading).toBeFalse();
      expect(component.isDownloaded).toBeTrue();
      expect(createSpy).toHaveBeenCalledWith(mockBlob);

      // Advance time by 3 seconds to check reset
      tick(3000);
      expect(component.isDownloaded).toBeFalse();
      expect(revokeSpy).toHaveBeenCalled();
    }));

    it('should set isError to true on download failure', () => {
      adminServiceSpy.getMasterExcel.and.returnValue(throwError(() => new Error('Server Error')));
      
      component.downloadMasterExcel();

      expect(component.isError).toBeTrue();
      expect(component.isLoading).toBeFalse();
    });
  });

  describe('uploadExcel', () => {
    it('should set isUploading state correctly on successful upload', () => {
      const mockFile = new File([''], 'test.xlsx', { type: 'application/vnd.ms-excel' });
      adminServiceSpy.importExcel.and.returnValue(of({ flag: 'S', message: 'Success' }));

      component.uploadExcel(mockFile);

      expect(component.isUploading).toBeFalse();
      expect(component.isError).toBeFalse();
      expect(adminServiceSpy.importExcel).toHaveBeenCalledWith(mockFile);
    });

    it('should set isError when API returns a failure flag', () => {
      const mockFile = new File([''], 'test.xlsx');
      adminServiceSpy.importExcel.and.returnValue(of({ flag: 'F', message: 'Invalid format' }));

      component.uploadExcel(mockFile);

      expect(component.isError).toBeTrue();
      expect(component.isUploading).toBeFalse();
    });
  });

  it('should handle file selection from input event', () => {
    const mockFile = new File([''], 'test.xlsx');
    const event = {
      target: {
        files: [mockFile],
        value: 'test.xlsx'
      }
    };
    
    const uploadSpy = spyOn(component, 'uploadExcel');
    
    component.onFileSelected(event);

    expect(uploadSpy).toHaveBeenCalledWith(mockFile);
    expect(event.target.value).toBe(''); // Verifies input reset
  });
});