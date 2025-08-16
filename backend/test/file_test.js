// backend/test/file_test.js
const chai = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const fs = require('fs');
const File = require('../models/File');
const { uploadFile, getFiles, renameFile, deleteFile } = require('../controllers/fileController');

const { expect } = chai;

describe('File Controller', () => {

    // This hook runs after each test and restores all stubs, spies, and mocks.
    
    afterEach(() => {
        sinon.restore();
    });

    // Test for uploadFile
    
    describe('UploadFile Function Test', () => {
        it('should create a new file record successfully on upload', async () => {
            const req = {
                user: { id: new mongoose.Types.ObjectId() },
                file: { originalname: 'test.txt', path: 'uploads/file-12345.txt', size: 1024 }
            };
            const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
            const createdFile = { _id: new mongoose.Types.ObjectId(), ...req.file, userId: req.user.id };
            
            const createStub = sinon.stub(File, 'create').resolves(createdFile);

            await uploadFile(req, res);

            expect(createStub.calledOnce).to.be.true;
            expect(res.status.calledOnceWith(201)).to.be.true;
            expect(res.json.calledOnceWithMatch({ message: 'File uploaded successfully' })).to.be.true;
        });

        it('should return 400 if no file is uploaded', async () => {
            const req = { user: { id: 'someUserId' }, file: undefined };
            const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
            
            await uploadFile(req, res);
            
            expect(res.status.calledOnceWith(400)).to.be.true;
            expect(res.json.calledOnceWith({ message: 'Please upload a file' })).to.be.true;
        });
    });

    //  Test for getFiles
    
    describe('GetFiles Function Test', () => {
        it('should return files for the given user', async () => {
            const req = { user: { id: new mongoose.Types.ObjectId() } };
            const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };
            const mockFiles = [{ name: 'file1.txt' }];

            const findStub = sinon.stub(File, 'find').returns({
                sort: sinon.stub().resolves(mockFiles)
            });

            await getFiles(req, res);

            expect(findStub.calledOnceWith({ userId: req.user.id })).to.be.true;
            expect(res.json.calledOnceWith(mockFiles)).to.be.true;
        });

        it('should return 500 on a database error', async () => {
            const req = { user: { id: new mongoose.Types.ObjectId() } };
            const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };
            
            const findStub = sinon.stub(File, 'find').returns({
                sort: sinon.stub().throws(new Error('DB Error'))
            });

            await getFiles(req, res);

            expect(res.status.calledOnceWith(500)).to.be.true;
            expect(res.json.calledOnceWithMatch({ message: 'Server error' })).to.be.true;
        });
    });

    //  Test renameFile
       
    describe('RenameFile Function Test', () => {
        it('should rename a file successfully', async () => {
            const fileId = new mongoose.Types.ObjectId().toString();
            const userId = new mongoose.Types.ObjectId().toString();
            const mockFile = {
                _id: fileId,
                userId: userId,
                originalName: 'old-name.txt',
                save: sinon.stub().resolvesThis()
            };
            sinon.stub(File, 'findById').resolves(mockFile);
            
            const req = { params: { id: fileId }, user: { id: userId }, body: { newName: 'new-name' } };
            const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

            await renameFile(req, res);

            // Assertions
            expect(mockFile.save.calledOnce, 'expected file.save() to be called').to.be.true;
            expect(mockFile.originalName).to.equal('new-name.txt');
            expect(res.json.calledOnce, 'expected res.json() to be called').to.be.true;
            expect(res.json.getCall(0).args[0].message).to.equal('File renamed successfully');
        });

        it('should return 404 if file is not found', async () => {
            sinon.stub(File, 'findById').resolves(null);
            const req = { params: { id: 'someId' }, user: { id: 'someUserId' }, body: { newName: 'new-name' } };
            const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

            await renameFile(req, res);

            expect(res.status.calledOnceWith(404)).to.be.true;
        });
    });

    //  Test for deleteFile 
    
    describe('DeleteFile Function Test', () => {
        it('should delete a file successfully', async () => {
            const fileId = new mongoose.Types.ObjectId().toString();
            const userId = new mongoose.Types.ObjectId().toString();
            const mockFile = {
                _id: fileId,
                userId: userId,
                path: 'uploads/file-to-delete.txt',
                remove: sinon.stub().resolves()
            };
            sinon.stub(File, 'findById').resolves(mockFile);
            sinon.stub(fs, 'unlinkSync').returns(undefined); // Stub the SYNC version

            const req = { params: { id: fileId }, user: { id: userId } };
            const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

            await deleteFile(req, res);

            // Assertions
            expect(fs.unlinkSync.calledOnceWith(mockFile.path), 'expected fs.unlinkSync() to be called').to.be.true;
            expect(mockFile.remove.calledOnce, 'expected file.remove() to be called').to.be.true;
            expect(res.json.calledOnce, 'expected res.json() to be called').to.be.true;
            expect(res.json.getCall(0).args[0].message).to.equal('File deleted successfully');
        });

        it('should return 404 if file to delete is not found', async () => {
            sinon.stub(File, 'findById').resolves(null);
            const unlinkStub = sinon.stub(fs, 'unlinkSync');
            const req = { params: { id: 'someId' }, user: { id: 'someUserId' } };
            const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

            await deleteFile(req, res);

            expect(unlinkStub.called).to.be.false;
            expect(res.status.calledOnceWith(404)).to.be.true;
        });
    });
});
