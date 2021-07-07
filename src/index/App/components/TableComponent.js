import React from 'react';
import 'antd/dist/antd.css';
import { Table, Button } from 'antd';

const columns = [
  {
    title: 'Industry',
    dataIndex: 'industry',
    fixed: 'left'
  },
  {
    title: 'Organisation',
    dataIndex: 'organization',
    fixed: 'left'
  },
  {
    title: 'Website',
    dataIndex: 'website',
  },
  {
    title: 'Contacts',
    dataIndex: 'contacts',
  },
  {
    title: 'Contact person',
    dataIndex: 'contactPerson',
  },
  {
    title: 'Telephone',
    dataIndex: 'telephone',
  },
  {
    title: 'Designation',
    dataIndex: 'designation',
  },
  {
    title: 'Email address',
    dataIndex: 'emailAddress',
  },
  {
    title: 'Physical location',
    dataIndex: 'physicalLocation',
  },
  {
    title: 'Comments',
    dataIndex: 'comments',
  },
  {
    title: 'Project',
    dataIndex: 'projectName',
  },
  {
    title: 'Status',
    dataIndex: 'status',
  },
  {
    title: 'Collection time',
    dataIndex: 'collectionTime',
  },
  {
    title: 'Submitted by',
    dataIndex: 'submittedBy',
  },
];

const data = [];
for (let i = 0; i < 46; i++) {
  data.push({
    key: i,
    name: `Edward King ${i}`,
    age: 32,
    address: `London, Park Lane no. ${i}`,
  });
}

class TableComponent extends React.Component {
  state = {
    selectedRowKeys: [], // Check here to configure the default column
    loading: false,
  };

  start = () => {
    this.setState({ loading: true });
    // ajax request after empty completing
    setTimeout(() => {
      this.setState({
        selectedRowKeys: [],
        loading: false,
      });
    }, 1000);
  };

  onSelectChange = selectedRowKeys => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  };

  render() {
    const { loading, selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
    return (
      <div>
        <div style={{ marginBottom: 16 }}>
          <Button type="primary" onClick={this.start} disabled={!hasSelected} loading={loading}>
            Reload
          </Button>
          <span style={{ marginLeft: 8 }}>
            {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
          </span>
        </div>
        <Table rowSelection={rowSelection} columns={columns} dataSource={this.props.data}  />
      </div>
    );
  }
}

export default TableComponent