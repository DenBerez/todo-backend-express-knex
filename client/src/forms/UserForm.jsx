// Example for a User form
<form onSubmit={this.handleUserSubmit}>
    <select value={method} onChange={this.changeMethod}>
        <option value="GET">Get</option>
        <option value="POST">Post</option>
        <option value="PATCH">Patch</option>
        <option value="DELETE">Delete</option>
    </select>

    <input
        type="text"
        placeholder="User ID"
        value={userId}
        onChange={e => this.setState({ userId: e.target.value })}
    />

    {method === "POST" || method === "PATCH" ? (
        <>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={e => this.setState({ username: e.target.value })}
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => this.setState({ email: e.target.value })}
            />
            <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={e => this.setState({ fullName: e.target.value })}
            />
        </>
    ) : null}

    <button type="submit">Submit</button>
</form>